package com.example.ebaysearch

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.Spinner
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.bumptech.glide.Glide
import org.json.JSONArray
import org.json.JSONObject

private const val ARG_PARAM1 = "itemId"
private const val ARG_PARAM2 = "itemInfo"

class SimilarProductsFragment : Fragment() {
    private lateinit var recyclerView: RecyclerView
    private lateinit var spinnerKey: Spinner
    private lateinit  var spinnerOrder: Spinner
    private lateinit var itemId: String
    private lateinit var itemInfo: String
    private var recylerViewAdapter: SimilarItemAdapter = SimilarItemAdapter(JSONArray())
    private var itemsList: JSONArray = JSONArray()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            itemId = it.getString(ARG_PARAM1, "")
            itemInfo = it.getString(ARG_PARAM2, "")
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_similar_products, container, false)
        spinnerKey = view.findViewById(R.id.spinner1)
        spinnerOrder = view.findViewById(R.id.spinner2)
        recyclerView = view.findViewById(R.id.similarProductsRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.setHasFixedSize(true)

        ArrayAdapter.createFromResource(
            requireContext(),
            R.array.similar_results_keys_array,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinnerKey.adapter = adapter
        }

        ArrayAdapter.createFromResource(
            requireContext(),
            R.array.similar_results_order_array,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinnerOrder.adapter = adapter
        }

        spinnerKey.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View, pos: Int, id: Long) {
                sortRecyclerView(pos, spinnerOrder.selectedItemPosition)
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        spinnerOrder.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View, pos: Int, id: Long) {
                sortRecyclerView(spinnerKey.selectedItemPosition, pos)
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        spinnerKey.setSelection(getIndex(spinnerKey, "Default"))
        spinnerOrder.setSelection(getIndex(spinnerOrder, "Ascending"))
        spinnerOrder.isEnabled = false

        loadSimilarProducts(itemId)
        return view
    }

    private fun getIndex(spinner: Spinner, str: String): Int {
        val adapter = spinner.adapter
        for (i in 0 until adapter.count) {
            if (adapter.getItem(i).toString().equals(str, ignoreCase = true)) {
                return i
            }
        }
        return 0
    }

    private fun getNestedValue(jsonObject: JSONObject, nestedKeys: List<String>): Comparable<*> {
        var currentObject: JSONObject = jsonObject
        for (key in nestedKeys) {
            if (key == nestedKeys[nestedKeys.size - 1]) {
                if (key == "title") {
                    return currentObject.getString(key)
                } else {
                    return currentObject.getDouble(key)
                }
            }
            currentObject = currentObject.getJSONObject(key)
        }

        return currentObject.toString()
    }

    private fun sortJsonArrayByNestedKey(jsonArray: JSONArray, nestedKeys: List<String>, order: Int): JSONArray {
        val jsonList = mutableListOf<JSONObject>()
        for (i in 0 until jsonArray.length()) {
            jsonList.add(jsonArray.getJSONObject(i))
        }

        var sortedList = jsonList.sortedWith(compareBy { getNestedValue(it, nestedKeys) })

        if (order == 1) {
            sortedList = sortedList.reversed()
        }

        val sortedJsonArray = JSONArray()
        for (jsonObject in sortedList) {
            sortedJsonArray.put(jsonObject)
        }

        return sortedJsonArray
    }
    private fun sortRecyclerView(key: Int, order: Int) {
        var orderTemp = order
        var nestedKeys:List<String> = listOf("")

        for (i in 0 until itemsList.length()) {
            val jsonObject = itemsList.getJSONObject(i)
            jsonObject.put("index", (i+1).toString())
            jsonObject.put("daysLeft", jsonObject.getString("timeLeft").substringAfter('P').substringBefore('D').toFloat())
            itemsList.put(i, jsonObject)
        }

        spinnerOrder.isEnabled = true

        if (key == 1) {
            nestedKeys = listOf("title")
        } else if (key == 2) {
            nestedKeys = listOf("buyItNowPrice", "__value__")
        } else if (key == 3) {
            nestedKeys = listOf("daysLeft")
        } else {
            nestedKeys = listOf("index")
            orderTemp = getIndex(spinnerOrder, "Ascending")
            spinnerOrder.setSelection(getIndex(spinnerOrder, "Ascending"))
            spinnerOrder.isEnabled = false
        }

        itemsList = sortJsonArrayByNestedKey(itemsList, nestedKeys, orderTemp)

        recylerViewAdapter.updateProducts(itemsList)

        recylerViewAdapter.notifyDataSetChanged()
    }

    private fun loadSimilarProducts(itemId: String) {
        val application = (requireActivity().application as EbaySearchApplication)
        val host = application.HOST
        var url = host + "ebay/get_similar_items?"

        url = application.addParameters(url, "itemId", itemId)
        val jsonObjectRequest = JsonObjectRequest(
            Request.Method.GET, url, null,
            { response ->
                itemsList = response.getJSONObject("getSimilarItemsResponse").getJSONObject("itemRecommendations").getJSONArray("item")
                recylerViewAdapter = SimilarItemAdapter(itemsList)
                recyclerView.adapter = recylerViewAdapter
            },
            { error ->
                Log.e("similar products api error", error.toString())
            })

        val requestQueue = application.requestQueue
        requestQueue.add(jsonObjectRequest)
    }

    companion object {
        @JvmStatic
        fun newInstance(itemId: String, itemInfo: String) =
            SimilarProductsFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, itemId)
                    putString(ARG_PARAM2, itemInfo)
                }
            }
    }
}

class SimilarItemAdapter (private var products: JSONArray) : RecyclerView.Adapter<SimilarItemAdapter.ItemViewHolder>() {

    class ItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val itemTitle: TextView = view.findViewById(R.id.product_title)
        val itemShipping: TextView = view.findViewById(R.id.product_shipping)
        val itemPrice: TextView = view.findViewById(R.id.product_price)
        val itemDaysLeft: TextView = view.findViewById(R.id.product_days_left)
        val itemImage: ImageView = view.findViewById(R.id.product_image)

        fun bind(jsonObject: JSONObject) {
            itemTitle.text = jsonObject.getString("title")
            itemPrice.text = jsonObject.getJSONObject("buyItNowPrice").getString("__value__")
            itemShipping.text = jsonObject.getJSONObject("shippingCost").getString("__value__")
            val daysLeftData = jsonObject.getString("timeLeft")
            itemDaysLeft.text = daysLeftData.substringAfter('P')
                .substringBefore('D') + " Days\nLeft"
            Glide.with(itemView.context).load(jsonObject.getString("imageURL")).into(itemImage)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.similar_product_card_layout, parent, false)
        return ItemViewHolder(view)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.bind(products.getJSONObject(position))
    }

    override fun getItemCount(): Int {
        return products.length()
    }

    fun updateProducts(updatedProducts: JSONArray) {
        products = updatedProducts
        notifyDataSetChanged()
    }
}
