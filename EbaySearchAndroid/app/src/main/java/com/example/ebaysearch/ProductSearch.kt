package com.example.ebaysearch

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.RadioButton
import android.widget.TextView
import android.widget.Toast

class ProductSearch : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_product_search, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val enableNearbySearchCheckbox = view.findViewById<CheckBox>(R.id.enableNearbySearchCheckBox)
        val hiddenField = view.findViewById<LinearLayout>(R.id.extraLocationSearch)

        enableNearbySearchCheckbox.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                // If the checkbox is checked, make the fields visible
                hiddenField.visibility = View.VISIBLE
            } else {
                // Otherwise, hide the fields
                hiddenField.visibility = View.GONE
            }
        }

        val zipcodeEnableRadioButton = view.findViewById<RadioButton>(R.id.zipcodeRadioButton)
        val zipcodeEditText = view.findViewById<EditText>(R.id.zipcodeText)
        var zipCodeErrorText = view.findViewById<TextView>(R.id.zipcodeErrorText)

        zipcodeEnableRadioButton.setOnCheckedChangeListener { _, isChecked ->
            zipcodeEditText.isEnabled = isChecked
            if (!isChecked) {
                zipcodeEditText.setText("")
            }
        }

        var searchButton = view.findViewById<Button>(R.id.searchButton)
        var keywordEditText = view.findViewById<EditText>(R.id.keywordEditText)
        var keywordErrorText = view.findViewById<TextView>(R.id.keywordErrorText)

        searchButton.setOnClickListener {
            val keyword = keywordEditText.text.toString()
            if (keyword.isBlank()) {
                keywordErrorText.visibility = View.VISIBLE
                Toast.makeText(it.context, "Please fix all fields with errors", Toast.LENGTH_LONG).show()
            }
            else if (enableNearbySearchCheckbox.isChecked() && zipcodeEnableRadioButton.isChecked() && zipcodeEditText.text.toString().isBlank()) {
                zipCodeErrorText.visibility = View.VISIBLE
                Toast.makeText(it.context, "Please fix all fields with errors", Toast.LENGTH_LONG).show()
            }
            else {
                keywordErrorText.visibility = View.GONE
                zipCodeErrorText.visibility = View.GONE
                // Perform the search operation
            }
        }

    }
}