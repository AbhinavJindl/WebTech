package com.example.ebaysearch

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.widget.Toolbar

/*
“Create loading page in android studio (15 lines). ChatGPT, 4 Sep. version, OpenAI, 11 Sep. 2023, chat.openai.com/chat.
*/
class SearchResultsLoading : AppCompatActivity() {
    companion object {
        @JvmStatic
        var isActive = false

        @JvmStatic
        var instance: SearchResultsLoading? = null
            private set

        fun finishActivity() {
            instance?.finish()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isActive = false
        instance = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        isActive = true
        instance = this

        setContentView(R.layout.activity_search_results_loading)

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
    }
}