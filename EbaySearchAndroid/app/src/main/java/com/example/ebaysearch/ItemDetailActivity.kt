package com.example.ebaysearch

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import org.json.JSONObject

class ItemDetailActivity : AppCompatActivity() {
    private lateinit var viewPager: ViewPager2
    private lateinit var tabs: TabLayout
    private lateinit var adapter: ViewPagerAdapter
    private lateinit var fbBtn: ImageButton
    lateinit var HOST: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_item_detail)
        HOST = (application as EbaySearchApplication).HOST

        val itemId = intent.getStringExtra("ITEM_ID")?: "N/A"
        val itemTitle = intent.getStringExtra("ITEM_TITLE")?: "N/A"
        val itemInfo = intent.getStringExtra("ITEM_INFO")?: "N/A"

//        val itemId = "285426294099"
//        val itemTitle = "Apple iPhone 7 A1660 (Fully Unlocked) 32GB Silver (Excellent)"
//        val itemInfo = "{\"itemId\":\"285426294099\",\"title\":[\"Apple iPhone 7 A1660 (Fully Unlocked) 32GB Silver (Excellent)\"],\"globalId\":[\"EBAY-US\"],\"primaryCategory\":[{\"categoryId\":[\"9355\"],\"categoryName\":[\"Cell Phones & Smartphones\"]}],\"galleryURL\":[\"https:\\/\\/i.ebayimg.com\\/thumbs\\/images\\/g\\/66gAAOSw5cRk1twc\\/s-l140.jpg\"],\"viewItemURL\":[\"https:\\/\\/www.ebay.com\\/itm\\/Apple-iPhone-7-A1660-Fully-Unlocked-32GB-Silver-Excellent-\\/285426294099\"],\"autoPay\":[\"true\"],\"postalCode\":[\"900**\"],\"location\":[\"Los Angeles,CA,USA\"],\"country\":[\"US\"],\"storeInfo\":[{\"storeName\":[\"Wireless Source\"],\"storeURL\":[\"http:\\/\\/stores.ebay.com\\/Wireless-Source\"]}],\"sellerInfo\":[{\"sellerUserName\":[\"wireless-source\"],\"feedbackScore\":[\"5238\"],\"positiveFeedbackPercent\":[\"97.9\"],\"feedbackRatingStar\":[\"Green\"],\"topRatedSeller\":[\"false\"]}],\"shippingInfo\":[{\"shippingServiceCost\":[{\"@currencyId\":\"USD\",\"__value__\":\"0.0\"}],\"shippingType\":[\"Free\"],\"shipToLocations\":[\"Worldwide\"],\"expeditedShipping\":[\"false\"],\"oneDayShippingAvailable\":[\"false\"],\"handlingTime\":[\"1\"]}],\"sellingStatus\":[{\"currentPrice\":[{\"@currencyId\":\"USD\",\"__value__\":\"90.99\"}],\"convertedCurrentPrice\":[{\"@currencyId\":\"USD\",\"__value__\":\"90.99\"}],\"sellingState\":[\"Active\"],\"timeLeft\":[\"P19DT6H53M49S\"]}],\"listingInfo\":[{\"bestOfferEnabled\":[\"false\"],\"buyItNowAvailable\":[\"false\"],\"startTime\":[\"2023-08-12T01:10:55.000Z\"],\"endTime\":[\"2023-12-12T02:10:55.000Z\"],\"listingType\":[\"FixedPrice\"],\"gift\":[\"false\"],\"watchCount\":[\"199\"]}],\"returnsAccepted\":[\"true\"],\"distance\":[{\"@unit\":\"mi\",\"__value__\":\"5.0\"}],\"condition\":[{\"conditionId\":[\"2010\"],\"conditionDisplayName\":[\"Excellent - Refurbished\"]}],\"isMultiVariationListing\":[\"false\"],\"discountPriceInfo\":[{\"originalRetailPrice\":[{\"@currencyId\":\"USD\",\"__value__\":\"649.0\"}],\"pricingTreatment\":[\"STP\"],\"soldOnEbay\":[\"false\"],\"soldOffEbay\":[\"false\"]}],\"topRatedListing\":[\"false\"]}"


        // Toolbar Setup
        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        val toolbarTitle = findViewById<TextView>(R.id.toolbar_title)
        // Set the Toolbar to act as the ActionBar for this Activity window.
        setSupportActionBar(toolbar)
        // Get rid of the default title text that comes with the Toolbar
        supportActionBar?.setDisplayShowTitleEnabled(false)
        // Set custom title for the Toolbar
        toolbarTitle.text = itemTitle
        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowHomeEnabled(true)
        // Handle back button click
        toolbar.setNavigationOnClickListener {
            onBackPressed()
        }

        fbBtn = findViewById(R.id.fbBtn)
        viewPager = findViewById(R.id.viewPager)
        tabs = findViewById(R.id.detailTabsLayout)
        adapter = ViewPagerAdapter(this, itemId, itemInfo)
        viewPager.adapter = adapter
        val price = JSONObject(itemInfo).getJSONArray("sellingStatus").getJSONObject(0).getJSONArray("currentPrice").getJSONObject(0).getString("__value__")
        val link = JSONObject(itemInfo).getJSONArray("viewItemURL").getString(0)
        fbBtn.setOnClickListener{
            val shareText = "Buy $itemTitle at $price from the link below. $link"
            var urlIntent: Intent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse(
                    "https://www.facebook.com/sharer/sharer.php?u=${Uri.encode(link)}&hashtag=${
                        Uri.encode(
                            "#CSCI571Fall23AndroidApp"
                        )
                    }"
                )
            );
            startActivity(urlIntent)
        }

        TabLayoutMediator(tabs, viewPager) { tab, position ->
            // Set the tab titles here
            tab.text = when (position) {
                0 -> "PRODUCT"
                1 -> "SHIPPING"
                2 -> "PHOTOS"
                3 -> "SIMILAR"
                else -> null
            }
            tab.icon = when (position) {
                0 -> ContextCompat.getDrawable(this, R.drawable.information_variant)
                1 -> ContextCompat.getDrawable(this, R.drawable.truck_delivery)
                2 -> ContextCompat.getDrawable(this, R.drawable.google)
                3 -> ContextCompat.getDrawable(this, R.drawable.equal)
                else -> null
            }
        }.attach()
    }
}

class ViewPagerAdapter(activity: AppCompatActivity, itemId: String, itemInfo: String) : FragmentStateAdapter(activity) {

    private val fragments = arrayOf(
        ProductFragment.newInstance(itemId, itemInfo),
        ShippingFragment.newInstance(itemId, itemInfo),
        PhotosFragment.newInstance(itemId, itemInfo),
        SimilarProductsFragment.newInstance(itemId, itemInfo))
    override fun getItemCount(): Int = fragments.size

    fun setContent(fragmentIndex: Int, fragment: Fragment) {
        fragments[fragmentIndex] = fragment
        notifyItemChanged(fragmentIndex)
    }
    override fun createFragment(position: Int): Fragment {
        return fragments[position]
    }
}