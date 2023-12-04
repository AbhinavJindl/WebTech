package com.example.ebaysearch

import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.View.OnClickListener
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import com.mikhaellopez.circularprogressbar.CircularProgressBar
import org.json.JSONObject


private const val ARG_PARAM1 = "itemId"
private const val ARG_PARAM2 = "itemInfo"

class ShippingFragment : Fragment() {
    private lateinit var itemId: String
    private lateinit  var itemInfo: String

    private lateinit var storeNameValue: TextView
    private lateinit var feedbackScore: TextView
    private lateinit var feedbackStar: ImageView
    private lateinit var circularProgress: CircularProgressBar
    private lateinit var circularProgressText: TextView

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
        storeNameValue = view.findViewById(R.id.store_name_value)
        feedbackScore = view.findViewById(R.id.feedback_score_value)
        feedbackStar = view.findViewById(R.id.feedback_star)
        circularProgress = view.findViewById(R.id.circular_progress)
        circularProgressText = view.findViewById(R.id.circular_progress_text)


        val item = JSONObject(itemInfo)
        val storeInfo = item.getJSONArray("storeInfo").getJSONObject(0)
        val url = storeInfo.getJSONArray("storeURL").getString(0)
        val text = storeInfo.getJSONArray("storeName").getString(0)
        storeNameValue.text = text

        storeNameValue.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse(url)
            startActivity(intent)
        }

        val sellerInfo = item.getJSONArray("sellerInfo").getJSONObject(0)

        feedbackScore.text = sellerInfo.getJSONArray("feedbackScore").getString(0)
        val feedbackScr = sellerInfo.getJSONArray("feedbackScore").getString(0).toFloat()
        val feedbackRatingStar = sellerInfo.getJSONArray("feedbackRatingStar").getString(0)
        var iconSrc = R.drawable.star_circle_outline;
        if (feedbackScr >= 10000) {
            iconSrc = R.drawable.star_circle
        }
        feedbackStar.setImageResource(iconSrc)
        val regex = Regex("^([A-Z][a-z]*)[A-Z]?[a-z]*")
        feedbackStar.setColorFilter(Color.parseColor(getStarColor(regex.find(feedbackRatingStar)?.groups?.get(0)?.value ?: "")))

        sellerInfo.getJSONArray("positiveFeedbackPercent").getString(0)
        circularProgress.progress = sellerInfo.getJSONArray("positiveFeedbackPercent").getString(0).toFloat()
        circularProgressText.text = sellerInfo.getJSONArray("positiveFeedbackPercent").getString(0) + "%"
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