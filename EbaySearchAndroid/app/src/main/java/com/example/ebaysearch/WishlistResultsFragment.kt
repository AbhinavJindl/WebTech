package com.example.ebaysearch

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.view.isVisible
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.RecyclerView.AdapterDataObserver
import com.google.android.material.card.MaterialCardView
import org.json.JSONArray

class WishlistResultsFragment : Fragment() {
    private lateinit var wishlistResultsRecyclerView: RecyclerView
    private lateinit var adapter: ItemAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    private fun updateUi(view: View, items: JSONArray) {
        view.findViewById<MaterialCardView>(R.id.noResultsText).isVisible = (items.length() == 0)
        view.findViewById<LinearLayout>(R.id.body).isVisible = (items.length() != 0)
        var totalPrice = 0.0

        for (i in 0 until items.length()) {
            totalPrice += items.getJSONObject(i).getJSONArray("sellingStatus").getJSONObject(0).getJSONArray("currentPrice").getJSONObject(0).getString("__value__").toFloat()
        }
        /*
        “Print to 2 decimal places" (1 line). ChatGPT, 4 Sep. version, OpenAI, 11 Sep. 2023, chat.openai.com/chat.
        */
        view.findViewById<TextView>(R.id.wishlist_items_price).text = "\$" + String.format("%.2f", totalPrice)

        view.findViewById<TextView>(R.id.wishlist_items_count).text = "Wishlist Total(${items.length()} items)"
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_wishlist_results, container, false)
        wishlistResultsRecyclerView = view.findViewById(R.id.wishlistResultsRecyclerView)
        wishlistResultsRecyclerView.layoutManager = GridLayoutManager(requireContext(), 2)
        adapter = ItemAdapter(retrieveData(requireContext()), true)
        wishlistResultsRecyclerView.adapter = adapter
        adapter.registerAdapterDataObserver(object : AdapterDataObserver(){
            override fun onChanged() {
                super.onChanged()
                updateUi(view, retrieveData(requireContext()))
            }
        })
        updateUi(view, retrieveData(requireContext()))
        return view
    }

    override fun onResume() {
        super.onResume()
        adapter.products = retrieveData(requireContext())
        adapter.notifyDataSetChanged()
    }


    companion object {
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            WishlistResultsFragment().apply {
                arguments = Bundle().apply {
                }
            }
    }
}