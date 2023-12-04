package com.example.ebaysearch

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.RelativeLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.PagerSnapHelper
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.bumptech.glide.Glide
import com.squareup.picasso.Picasso
import org.json.JSONArray
import org.json.JSONObject


private const val ARG_PARAM1 = "itemId"
private const val ARG_PARAM2 = "itemInfo"

/**
 * A simple [Fragment] subclass.
 * Use the [ProductFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class ProductFragment : Fragment() {
    private lateinit var itemId: String
    private lateinit  var itemInfo: String

    private lateinit var progressBarView: RelativeLayout
    private lateinit var productDetailsContainerView: ScrollView
    private lateinit var productTitle: TextView
    private lateinit var productPrice: TextView
    private lateinit var productHighlight1: TextView
    private lateinit var productHighlight2: TextView
    private lateinit var productSpecifications: LinearLayout
    private lateinit var productImages: RecyclerView


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
        return inflater.inflate(R.layout.fragment_product, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        productImages = view.findViewById(R.id.product_images)
        progressBarView = view.findViewById(R.id.progress_bar)
        productDetailsContainerView = view.findViewById(R.id.product_details_container)
        productTitle = view.findViewById(R.id.product_title)
        productPrice = view.findViewById(R.id.product_price)
        productHighlight1 = view.findViewById(R.id.product_highlight1)
        productHighlight2 = view.findViewById(R.id.product_highlight2)
        productDetailsContainerView = view.findViewById(R.id.product_details_container)
        productSpecifications = view.findViewById(R.id.product_specifications)
        loadApiData(itemId, itemInfo)
    }

    private fun loadApiData(itemId: String, itemInfo: String) {
        val application = (requireActivity().application as EbaySearchApplication)
        val host = application.HOST
        var url = host + "ebay/get_single_item?"
        url = application.addParameters(url, "itemId", itemId)
        val jsonObjectRequest = JsonObjectRequest(
            Request.Method.GET, url, null,
            { response ->
                progressBarView.visibility = View.GONE
                productDetailsContainerView.visibility = View.VISIBLE
                val item = response.getJSONObject("Item")
                val productPictures = item.getJSONArray("PictureURL")
                productImages.adapter = ProductImagesAdapter(requireContext(), productPictures)
                productImages?.setLayoutManager(
                    LinearLayoutManager(
                        requireContext(), LinearLayoutManager.HORIZONTAL, false
                    )
                )
                val snap = PagerSnapHelper()
                snap.attachToRecyclerView(productImages)

                productTitle.text = item.getString("Title")

                var shippingCost = "Free"
                var shippingCostString = JSONObject(itemInfo).getJSONArray("shippingInfo").getJSONObject(0).getJSONArray("shippingServiceCost").getJSONObject(0).getString("__value__")
                if (shippingCostString != "0.0") {
                    shippingCost = "$" + shippingCostString
                }
                productPrice.text = "\$" + item.getJSONObject("CurrentPrice").getString("Value")  + " with " + shippingCost + " shipping"
                productHighlight1.text = "Price" + "\t\t\t" + "\$" + item.getJSONObject("CurrentPrice").getString("Value")
                val nameValueLists:JSONArray = item.getJSONObject("ItemSpecifics").getJSONArray("NameValueList")
                for (i in 0 until nameValueLists.length()) {
                    if (nameValueLists.getJSONObject(i).getString("Name") ==  "Brand") {
                        productHighlight2.visibility = View.VISIBLE
                        productHighlight2.text = "Brand" + "\t\t\t" + nameValueLists.getJSONObject(i).getJSONArray("Value").getString(0)
                    }
                }

                for (i in 0 until nameValueLists.length()) {
                    if (nameValueLists.getJSONObject(i).getString("Name") ==  "Brand") {
                        continue
                    }
                    val newTextView = TextView(context).apply {
                        text = "\u2022 " + nameValueLists.getJSONObject(i).getJSONArray("Value").getString(0)
                        textAlignment = View.TEXT_ALIGNMENT_TEXT_START}

                    productSpecifications.addView(newTextView)

                }
            },
            { error ->
                Log.e("fetch detail api error", error.toString())
            })

        val requestQueue = (application as EbaySearchApplication).requestQueue
        requestQueue.add(jsonObjectRequest)
    }

    companion object {
        @JvmStatic
        fun newInstance(itemId: String, itemInfo: String) =
            ProductFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, itemId)
                    putString(ARG_PARAM2, itemInfo)
                }
            }
    }
}

class ProductImagesAdapter(private val context: Context, private val imageUrls: JSONArray) : RecyclerView.Adapter<ProductImagesAdapter.ViewHolder>() {
    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageView: ImageView = view.findViewById(R.id.productImageView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.product_photos_tab_layout, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        Log.e("dada", position.toString())
        Glide.with(holder.itemView)
            .load(imageUrls.get(position))
            .into(holder.imageView)
    }

    override fun getItemCount(): Int = imageUrls.length()
}