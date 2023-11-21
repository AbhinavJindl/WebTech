package com.example.ebaysearch

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
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

        recyclerView = findViewById(R.id.searchResultsRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        val jsonString = intent.getStringExtra("itemsArray")
        val jsonArray = JSONArray(jsonString)
        adapter = ItemAdapter(jsonArray)
        recyclerView.adapter = adapter
    }
}