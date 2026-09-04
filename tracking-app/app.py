"""
DELIMOVI - Enterprise Logistics & Parcel Tracking Platform
Flask Backend Application
"""

import os
import datetime
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "delimovi-super-secure-logistics-secret-key-2026")

# In-Memory & Seeded Database for Real-Time Logistics Tracking
PARCELS_DB = {
    "DLM-8921-EU": {
        "tracking_number": "DLM-8921-EU",
        "status": "Out for Delivery",
        "progress_percent": 85,
        "service_tier": "Delimovi Prime Express Air",
        "carrier": "Delimovi Fleet UK",
        "sender": {
            "name": "Nordic Tech Logistics BV",
            "city": "Amsterdam",
            "country": "Netherlands",
            "hub": "AMS Central Hub"
        },
        "recipient": {
            "name": "Sarah Jenkins",
            "address": "42 Kensington High St, Apt 4B",
            "city": "London",
            "postal_code": "W8 4PT",
            "country": "United Kingdom"
        },
        "package_details": {
            "weight": "2.45 kg",
            "dimensions": "34 × 24 × 12 cm",
            "items": "High-Precision Audio Monitor & Cabling",
            "pieces": 1,
            "declared_value": "£340.00",
            "signature_required": True,
            "insured": True
        },
        "courier": {
            "name": "Marcus Vance",
            "id": "DRV-4091",
            "phone": "+44 7700 900142",
            "vehicle": "Electric Van (EV-88-LDN)",
            "rating": 4.95,
            "current_zone": "Kensington & Chelsea District"
        },
        "eta": "Today, by 4:30 PM",
        "created_at": "2026-08-28 09:15:00",
        "history": [
            {
                "timestamp": "2026-09-01 08:30",
                "status": "Out for Delivery",
                "location": "London West Delivery Depot, UK",
                "description": "Package loaded onto courier vehicle with Driver Marcus Vance. Final delivery window: 14:00 - 16:30.",
                "completed": True,
                "is_current": True
            },
            {
                "timestamp": "2026-09-01 04:15",
                "status": "Sorted at Local Facility",
                "location": "Heathrow Logistics Superhub, London, UK",
                "description": "Processed through automated optical sortation conveyor Line B-14.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-31 22:40",
                "status": "Customs Cleared",
                "location": "UK Border Control, Dover / Folkestone",
                "description": "Electronic customs documentation approved. Import duties zero-rated.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-30 18:00",
                "status": "In International Transit",
                "location": "Rotterdam Freight Terminal, Netherlands",
                "description": "Cross-channel freight transit initiated via Euro-Tunnel shuttle.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-29 11:20",
                "status": "Departed Origin Hub",
                "location": "Amsterdam Central Fulfillment Hub, Netherlands",
                "description": "Consolidated into Euro-Freight Container #EU-9921.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-28 09:15",
                "status": "Shipment Created & Picked Up",
                "location": "Amsterdam Depot, Netherlands",
                "description": "Shipping label generated and package received from vendor warehouse.",
                "completed": True,
                "is_current": False
            }
        ]
    },
    "DLM-4419-US": {
        "tracking_number": "DLM-4419-US",
        "status": "In Transit",
        "progress_percent": 55,
        "service_tier": "Delimovi Continental Priority",
        "carrier": "Delimovi North America",
        "sender": {
            "name": "Silicon Design Labs",
            "city": "San Jose, CA",
            "country": "United States",
            "hub": "SJC Air Cargo Center"
        },
        "recipient": {
            "name": "Dr. Aris Thorne",
            "address": "780 Broadway Ave",
            "city": "New York, NY",
            "postal_code": "10003",
            "country": "United States"
        },
        "package_details": {
            "weight": "5.10 kg",
            "dimensions": "45 × 30 × 20 cm",
            "items": "Optical Sensor Prototyping Kit",
            "pieces": 2,
            "declared_value": "$1,250.00",
            "signature_required": True,
            "insured": True
        },
        "courier": {
            "name": "TBD (Regional Dispatch)",
            "id": "DRV-PENDING",
            "phone": "+1 800 555 0199",
            "vehicle": "Freight Freightliner #NY-14",
            "rating": 4.9,
            "current_zone": "Midwest Linehaul Corridor"
        },
        "eta": "Tomorrow, Sep 2 by 12:00 PM",
        "created_at": "2026-08-30 14:00:00",
        "history": [
            {
                "timestamp": "2026-09-01 01:10",
                "status": "Arrived at Sorting Facility",
                "location": "Chicago O'Hare Freight Consolidation Center, IL",
                "description": "Midpoint cargo scan complete. En route to JFK/EWR regional distribution hub.",
                "completed": True,
                "is_current": True
            },
            {
                "timestamp": "2026-08-31 06:45",
                "status": "Departed Origin Hub",
                "location": "San Jose Air Logistics Center, CA",
                "description": "Departed on Flight DLM-Cargo 402.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-30 14:00",
                "status": "Shipment Information Received",
                "location": "San Jose, CA",
                "description": "Manifest generated and parcel picked up by local courier.",
                "completed": True,
                "is_current": False
            }
        ]
    },
    "DLM-7730-UK": {
        "tracking_number": "DLM-7730-UK",
        "status": "Delivered",
        "progress_percent": 100,
        "service_tier": "Delimovi EcoGround Carbon-Neutral",
        "carrier": "Delimovi Royal Network",
        "sender": {
            "name": "Edinburgh Artisan Roasters",
            "city": "Edinburgh",
            "country": "United Kingdom",
            "hub": "EDI Central"
        },
        "recipient": {
            "name": "Oliver Sterling",
            "address": "15 Cathedral Walk",
            "city": "Manchester",
            "postal_code": "M3 4BB",
            "country": "United Kingdom"
        },
        "package_details": {
            "weight": "1.20 kg",
            "dimensions": "20 × 15 × 10 cm",
            "items": "Single Origin Coffee Bean Selection",
            "pieces": 1,
            "declared_value": "£48.00",
            "signature_required": False,
            "insured": False
        },
        "courier": {
            "name": "Emma Watson",
            "id": "DRV-1188",
            "phone": "+44 7700 900881",
            "vehicle": "Cargo E-Bike (MAN-04)",
            "rating": 5.0,
            "current_zone": "Manchester Central"
        },
        "eta": "Delivered on Aug 31 at 14:22",
        "created_at": "2026-08-29 10:00:00",
        "history": [
            {
                "timestamp": "2026-08-31 14:22",
                "status": "Delivered",
                "location": "Manchester, UK",
                "description": "Delivered to safe place (Front Porch Parcel Box). Proof of delivery photo uploaded.",
                "completed": True,
                "is_current": True
            },
            {
                "timestamp": "2026-08-31 09:10",
                "status": "Out for Delivery",
                "location": "Manchester Sorting Depot, UK",
                "description": "Courier Emma Watson assigned for eco-friendly e-bike last-mile dispatch.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-30 08:30",
                "status": "In Transit",
                "location": "Northern Hub, Leeds, UK",
                "description": "Transferred via electric linehaul trailer.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-29 10:00",
                "status": "Picked Up by Carrier",
                "location": "Edinburgh, UK",
                "description": "Package collected from merchant.",
                "completed": True,
                "is_current": False
            }
        ]
    },
    "DLM-9912-JP": {
        "tracking_number": "DLM-9912-JP",
        "status": "Customs Clearance",
        "progress_percent": 40,
        "service_tier": "Delimovi Pacific Express",
        "carrier": "Delimovi Asia-Pacific",
        "sender": {
            "name": "Kyoto Crafts & Ceramics Co.",
            "city": "Kyoto",
            "country": "Japan",
            "hub": "KIX International Logistics"
        },
        "recipient": {
            "name": "Elena Rostova",
            "address": "Schönhauser Allee 102",
            "city": "Berlin",
            "postal_code": "10439",
            "country": "Germany"
        },
        "package_details": {
            "weight": "3.80 kg",
            "dimensions": "40 × 35 × 25 cm",
            "items": "Handcrafted Tea Sets & Porcelain",
            "pieces": 1,
            "declared_value": "€580.00",
            "signature_required": True,
            "insured": True
        },
        "courier": {
            "name": "Customs Inspection Officer",
            "id": "CUS-BER-09",
            "phone": "+49 30 18370",
            "vehicle": "Customs Bay 3",
            "rating": 4.8,
            "current_zone": "Frankfurt / Berlin Customs Clearing Gateway"
        },
        "eta": "Friday, Sep 4 by 17:00",
        "created_at": "2026-08-29 04:00:00",
        "history": [
            {
                "timestamp": "2026-09-01 03:00",
                "status": "Customs Clearance in Progress",
                "location": "Frankfurt Airport Customs Terminal, Germany",
                "description": "Standard import duty evaluation and document clearance in process.",
                "completed": True,
                "is_current": True
            },
            {
                "timestamp": "2026-08-31 16:30",
                "status": "Arrived in Destination Country",
                "location": "Frankfurt Cargo City South (FRA), Germany",
                "description": "Offloaded from Cargo Flight NH-8402.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-30 02:15",
                "status": "Departed Origin Country",
                "location": "Kansai International Airport (KIX), Japan",
                "description": "Export clearance finalized. Loaded for Frankfurt direct flight.",
                "completed": True,
                "is_current": False
            },
            {
                "timestamp": "2026-08-29 04:00",
                "status": "Order Registered",
                "location": "Kyoto, Japan",
                "description": "Package packed with reinforced foam wrapping and picked up.",
                "completed": True,
                "is_current": False
            }
        ]
    }
}

@app.route("/")
def home():
    recent_codes = list(PARCELS_DB.keys())
    return render_template("home.html", recent_codes=recent_codes, total_parcels=len(PARCELS_DB))

@app.route("/track", methods=["GET", "POST"])
def track():
    if request.method == "POST":
        tracking_number = request.form.get("tracking_number", "").strip().upper()
    else:
        tracking_number = request.args.get("tracking_number", "").strip().upper()

    if not tracking_number:
        flash("Please enter a valid tracking number.", "warning")
        return redirect(url_for("home"))

    parcel = PARCELS_DB.get(tracking_number)

    if not parcel:
        for key, val in PARCELS_DB.items():
            if tracking_number.replace("-", "") in key.replace("-", ""):
                parcel = val
                break

    if not parcel:
        return render_template("result.html", 
                               not_found=True, 
                               tracking_number=tracking_number,
                               sample_codes=list(PARCELS_DB.keys()))

    return render_template("result.html", parcel=parcel, not_found=False)

@app.route("/api/track/<tracking_number>")
def api_track(tracking_number):
    tracking_number = tracking_number.strip().upper()
    parcel = PARCELS_DB.get(tracking_number)
    if not parcel:
        return jsonify({"success": False, "error": "Parcel not found", "tracking_number": tracking_number}), 404
    return jsonify({"success": True, "parcel": parcel})

@app.route("/api/parcels", methods=["GET", "POST"])
def api_parcels():
    if request.method == "POST":
        data = request.get_json() or {}
        code = f"DLM-{datetime.datetime.now().strftime('%M%S')}-{data.get('country_code', 'US').upper()}"
        new_parcel = {
            "tracking_number": code,
            "status": "Order Registered",
            "progress_percent": 15,
            "service_tier": data.get("service_tier", "Delimovi Standard Cargo"),
            "carrier": "Delimovi Express Network",
            "sender": {
                "name": data.get("sender_name", "Global Merchant Depot"),
                "city": data.get("sender_city", "Origin Hub"),
                "country": data.get("sender_country", "USA"),
                "hub": "Primary Sorting Facility"
            },
            "recipient": {
                "name": data.get("recipient_name", "Valued Customer"),
                "address": data.get("recipient_address", "100 Delivery Lane"),
                "city": data.get("recipient_city", "Destination City"),
                "postal_code": data.get("recipient_zip", "90210"),
                "country": data.get("recipient_country", "USA")
            },
            "package_details": {
                "weight": f"{data.get('weight', '1.5')} kg",
                "dimensions": "30 × 20 × 15 cm",
                "items": data.get("items_desc", "Standard Commercial Package"),
                "pieces": 1,
                "declared_value": "$100.00",
                "signature_required": False,
                "insured": True
            },
            "courier": {
                "name": "Assigned upon final route",
                "id": "DRV-TBD",
                "phone": "+1 800 555 0100",
                "vehicle": "Standard Van",
                "rating": 4.9,
                "current_zone": "Origin Logistics Bay"
            },
            "eta": "In 3 Business Days",
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "history": [
                {
                    "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "status": "Order Registered & Label Generated",
                    "location": data.get("sender_city", "Origin Hub"),
                    "description": "Shipping order initialized in Delimovi logistics network.",
                    "completed": True,
                    "is_current": True
                }
            ]
        }
        PARCELS_DB[code] = new_parcel
        return jsonify({"success": True, "parcel": new_parcel, "tracking_number": code}), 201

    return jsonify({"success": True, "parcels": list(PARCELS_DB.values())})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
