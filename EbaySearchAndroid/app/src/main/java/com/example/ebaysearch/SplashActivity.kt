package com.example.ebaysearch

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.view.View

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN
        actionBar?.hide()

        // Use a handler to delay the transition to the main activity
        Handler().postDelayed({
            startActivity(Intent(this, TabActivity::class.java))
            finish() // Close the splash activity so the user can't return to it
        }, 2000)
    }
}