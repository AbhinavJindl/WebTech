package com.example.ebaysearch

import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import org.json.JSONArray

class WishlistResultsFragment : Fragment() {
    private lateinit var wishlistResultsRecyclerView: RecyclerView
    private lateinit var adapter: ItemAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_wishlist_results, container, false)

        wishlistResultsRecyclerView = view.findViewById(R.id.wishlistResultsRecyclerView)
        wishlistResultsRecyclerView.layoutManager = LinearLayoutManager(requireContext())

        val jsonArray = JSONArray(retrieveData(requireContext()))
        adapter = ItemAdapter(jsonArray)
        wishlistResultsRecyclerView.adapter = adapter

        return view
    }

    fun saveData(context: Context, value: String) {
        val sharedPreferences = context.getSharedPreferences("WishlistItems", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()

        editor.putString("items", value)
        editor.apply()
    }

    fun retrieveData(context: Context): String {
        val sharedPreferences = context.getSharedPreferences("WishlistItems", Context.MODE_PRIVATE)
        return sharedPreferences.getString("items", "") ?: ""
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