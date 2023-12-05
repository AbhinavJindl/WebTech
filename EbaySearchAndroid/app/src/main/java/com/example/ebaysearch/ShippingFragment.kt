package com.example.ebaysearch

import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.style.BackgroundColorSpan
import android.text.style.UnderlineSpan
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
import androidx.core.view.isVisible
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.mikhaellopez.circularprogressbar.CircularProgressBar
import org.json.JSONObject


private const val ARG_PARAM1 = "itemId"
private const val ARG_PARAM2 = "itemInfo"

class ShippingFragment : Fragment() {
    private lateinit var itemId: String
    private lateinit  var itemInfo: String

    private lateinit var progressBarView: RelativeLayout
    private lateinit var shippingContainerView: LinearLayout
    private lateinit var storeNameValue: TextView
    private lateinit var feedbackScore: TextView
    private lateinit var feedbackStar: ImageView
    private lateinit var circularProgress: CircularProgressBar
    private lateinit var circularProgressText: TextView
    private lateinit var shippingCost: TextView
    private lateinit var globalShipping: TextView
    private lateinit var handlingTime: TextView
    private lateinit var policy: TextView
    private lateinit var returnWithin: TextView
    private lateinit var refundMode: TextView
    private lateinit var shippedBy: TextView

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
        return inflater.inflate(R.layout.fragment_shipping, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        progressBarView = view.findViewById(R.id.progress_bar)
        shippingContainerView = view.findViewById(R.id.product_shipping_container)
        storeNameValue = view.findViewById(R.id.store_name_value)
        feedbackScore = view.findViewById(R.id.feedback_score_value)
        feedbackStar = view.findViewById(R.id.feedback_star)
        circularProgress = view.findViewById(R.id.circular_progress)
        circularProgressText = view.findViewById(R.id.circular_progress_text)
        shippingCost = view.findViewById(R.id.shipping_cost_value)
        globalShipping = view.findViewById(R.id.global_shipping_value)
        handlingTime = view.findViewById(R.id.handling_time_value)
        policy = view.findViewById(R.id.policy_value)
        returnWithin = view.findViewById(R.id.returns_within_value)
        refundMode = view.findViewById(R.id.refund_mode_value)
        shippedBy = view.findViewById(R.id.shipped_by_value)
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
                progressBarView.isVisible = false
                shippingContainerView.isVisible = true
                val singleItem = response.getJSONObject("Item")
                val storeFrontInfo = singleItem.getJSONObject("Storefront")
                val text = storeFrontInfo.getString("StoreName")
                val spannableString = SpannableString(text)
                spannableString.setSpan(
                    UnderlineSpan(),
                    0,
                    text.length,
                    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                )
                storeNameValue.text = spannableString

                storeNameValue.setOnClickListener {
                    val intent = Intent(Intent.ACTION_VIEW)
                    spannableString.setSpan(
                        BackgroundColorSpan(Color.parseColor("#EACAFF")),
                        0,
                        text.length,
                        Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                    )
                    intent.data = Uri.parse(storeFrontInfo.getString("StoreURL"))
                    startActivity(intent)
                    storeNameValue.setBackgroundColor(Color.parseColor("#EACAFF"))
                }

                val sellerInfo = singleItem.getJSONObject("Seller")
                feedbackScore.text = sellerInfo.getInt("FeedbackScore").toString()
                val feedbackScr = sellerInfo.getInt("FeedbackScore")
                val feedbackRatingStar = sellerInfo.getString("FeedbackRatingStar")
                var iconSrc = R.drawable.star_circle_outline;
                if (feedbackScr >= 10000) {
                    iconSrc = R.drawable.star_circle
                }
                feedbackStar.setImageResource(iconSrc)
                val regex = Regex("^([A-Z][a-z]*)[A-Z]?[a-z]*")
                feedbackStar.setColorFilter(Color.parseColor(getStarColor(regex.find(feedbackRatingStar)?.groups?.get(0)?.value ?: "")))
                val feedbackPercent = sellerInfo.getDouble("PositiveFeedbackPercent")
                circularProgress.progress = String.format("%.1f", feedbackPercent).toFloat()
                circularProgressText.text = String.format("%.1f", feedbackPercent) + "%"

//                Shipping Info
                val shippingInfo = JSONObject(itemInfo).getJSONArray("shippingInfo").getJSONObject(0)
                val shippingVal = shippingInfo.getJSONArray("shippingServiceCost").getJSONObject(0).getString("__value__")
                if (shippingVal == "0.0") {
                    shippingCost.text = "Free"
                } else {
                    shippingCost.text = shippingVal
                }
                globalShipping.text = if (singleItem.getBoolean("GlobalShipping")) "Yes" else "No"
                handlingTime.text = singleItem.getString("HandlingTime")

//Return Plocy
                val returnPolicy = singleItem.getJSONObject("ReturnPolicy")
                policy.text = returnPolicy.getString("ReturnsAccepted")
                refundMode.text = returnPolicy.getString("Refund")
                returnWithin.text = returnPolicy.getString("ReturnsWithin")
                shippedBy.text = returnPolicy.getString("ShippingCostPaidBy")
            },
            { error ->
                Log.e("fetch detail api error", error.toString())
            })

        val requestQueue = (application as EbaySearchApplication).requestQueue
        requestQueue.add(jsonObjectRequest)
    }


    fun getStarColor(color: String): String {
        return when (color) {
            "Yellow" -> "#FFFF00" // Hex code for yellow
            "Blue" -> "#0000FF" // Hex code for blue
            "Turquoise" -> "#40E0D0" // Hex code for turquoise
            "Purple" -> "#800080" // Hex code for purple
            "Red" -> "#FF0000" // Hex code for red
            "Green" -> "#008000" // Hex code for green
            "YellowShooting" -> "#FFFF00" // Hex code for yellow
            "TurquoiseShooting" -> "#40E0D0" // Hex code for turquoise
            "PurpleShooting" -> "#800080" // Hex code for purple
            "RedShooting" -> "#FF0000" // Hex code for red
            "GreenShooting" -> "#008000" // Hex code for green
            "SilverShooting" -> "#C0C0C0" // Hex code for silver
            else -> "#FFFFFF" // Hex code for white
        }
    }

    companion object {
        @JvmStatic
        fun newInstance(itemId: String, itemInfo: String) =
            ShippingFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, itemId)
                    putString(ARG_PARAM2, itemInfo)
                }
            }
    }
}