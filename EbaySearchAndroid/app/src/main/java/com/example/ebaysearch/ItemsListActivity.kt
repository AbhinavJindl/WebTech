package com.example.ebaysearch

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import androidx.appcompat.widget.Toolbar
import androidx.core.view.isVisible
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.RecyclerView.AdapterDataObserver
import com.google.android.material.card.MaterialCardView
import org.json.JSONArray

class ItemsListActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ItemAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_items_list)

        // Toolbar Setup
        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        val toolbarTitle = findViewById<TextView>(R.id.toolbar_title)
        // Set the Toolbar to act as the ActionBar for this Activity window.
        setSupportActionBar(toolbar)
        // Get rid of the default title text that comes with the Toolbar
        supportActionBar?.setDisplayShowTitleEnabled(false)
        // Set custom title for the Toolbar
        toolbarTitle.text = getString(R.string.search_results)
        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowHomeEnabled(true)
        // Handle back button click
        toolbar.setNavigationOnClickListener {
            onBackPressed()
        }

        val jsonString = intent.getStringExtra("itemsArray")
        val jsonArray = JSONArray(jsonString)
        recyclerView = findViewById(R.id.searchResultsRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)
        adapter = ItemAdapter(jsonArray, false)
        recyclerView.adapter = adapter
        findViewById<MaterialCardView>(R.id.noResultsText).isVisible = jsonArray.length() == 0
        recyclerView.isVisible = jsonArray.length() != 0
    }

    override fun onRestart() {
        super.onRestart()
        adapter.notifyDataSetChanged()
    }
}