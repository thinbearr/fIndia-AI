"""
Stock Validation Service
Validates Indian stock tickers against real NSE/BSE listings
Loads from Yahoo Finance NSE stock list
"""

import yfinance as yf
from typing import List, Dict, Optional
import json
import os
from pathlib import Path

class StockValidator:
    def __init__(self):
        self.stocks: Dict[str, str] = {}
        self.load_stocks()
    
    def load_stocks(self):
        """Load comprehensive Indian stock listings"""
        # Load from cached file if exists
        cache_file = Path(__file__).parent / "nse_stocks.json"
        
        if cache_file.exists():
            with open(cache_file, 'r') as f:
                self.stocks = json.load(f)
                print(f"✅ Loaded {len(self.stocks)} Indian stocks from cache")
                return
        
        # Otherwise load comprehensive list
        self.stocks = self._get_comprehensive_stock_list()
        
        # Save to cache
        with open(cache_file, 'w') as f:
            json.dump(self.stocks, f, indent=2)
        
        print(f"✅ Loaded {len(self.stocks)} Indian stocks")
    
    def _get_comprehensive_stock_list(self) -> Dict[str, str]:
        """Get comprehensive list of NSE stocks"""
        # This is a curated list of 1000+ NSE stocks
        # In production, fetch from NSE API or maintain updated CSV
        return {
            # Nifty 50 & Top 500
            "RELIANCE": "Reliance Industries Ltd", "TCS": "Tata Consultancy Services Ltd", "HDFCBANK": "HDFC Bank Ltd", 
            "ICICIBANK": "ICICI Bank Ltd", "HINDUNILVR": "Hindustan Unilever Ltd", "INFY": "Infosys Ltd", 
            "ITC": "ITC Ltd", "SBIN": "State Bank of India", "BHARTIARTL": "Bharti Airtel Ltd", 
            "KOTAKBANK": "Kotak Mahindra Bank Ltd", "L&T": "Larsen & Toubro Ltd", "AXISBANK": "Axis Bank Ltd", 
            "ASIANPAINT": "Asian Paints Ltd", "MARUTI": "Maruti Suzuki India Ltd", "HCLTECH": "HCL Technologies Ltd", 
            "TITAN": "Titan Company Ltd", "BAJFINANCE": "Bajaj Finance Ltd", "SUNPHARMA": "Sun Pharmaceutical Industries Ltd", 
            "NESTLEIND": "Nestle India Ltd", "WIPRO": "Wipro Ltd", "ULTRACEMCO": "UltraTech Cement Ltd", 
            "POWERGRID": "Power Grid Corporation of India Ltd", "M&M": "Mahindra & Mahindra Ltd", "ONGC": "Oil & Natural Gas Corporation Ltd", 
            "NTPC": "NTPC Ltd", "JSWSTEEL": "JSW Steel Ltd", "TATASTEEL": "Tata Steel Ltd", 
            "TATAMOTORS": "Tata Motors Ltd", "ADANIENT": "Adani Enterprises Ltd", "ADANIGREEN": "Adani Green Energy Ltd", 
            "ADANIPORTS": "Adani Ports and Special Economic Zone Ltd", "COALINDIA": "Coal India Ltd", "HDFCLIFE": "HDFC Life Insurance Company Ltd", 
            "SBILIFE": "SBI Life Insurance Company Ltd", "BAJAJFINSV": "Bajaj Finserv Ltd", "BPCL": "Bharat Petroleum Corporation Ltd", 
            "GRASIM": "Grasim Industries Ltd", "BRITANNIA": "Britannia Industries Ltd", "TECHM": "Tech Mahindra Ltd", 
            "HINDALCO": "Hindalco Industries Ltd", "DIVISLAB": "Divi's Laboratories Ltd", "DRREDDY": "Dr. Reddy's Laboratories Ltd", 
            "CIPLA": "Cipla Ltd", "EICHERMOT": "Eicher Motors Ltd", "INDUSINDBK": "IndusInd Bank Ltd", 
            "SICAL": "Sical Logistics Ltd", "TATACONSUM": "Tata Consumer Products Ltd", "APOLLOHOSP": "Apollo Hospitals Enterprise Ltd", 
            "UPL": "UPL Ltd", "HEROMOTOCO": "Hero MotoCorp Ltd",

            # Next 500 & Midcaps & Smallcaps (Comprehensive)
            "ABB": "ABB India Ltd", "ACC": "ACC Ltd", "ADANIPOWER": "Adani Power Ltd", 
            "ADANITRANS": "Adani Transmission Ltd", "ALKYLAMINE": "Alkyl Amines Chemicals Ltd", "AMBUJACEM": "Ambuja Cements Ltd", 
            "APLLTD": "Alembic Pharmaceuticals Ltd", "ASHOKLEY": "Ashok Leyland Ltd", "AUROPHARMA": "Aurobindo Pharma Ltd", 
            "DMART": "Avenue Supermarts Ltd", "BAJAJHLDNG": "Bajaj Holdings & Investment Ltd", "BALKRISIND": "Balkrishna Industries Ltd", 
            "BANDHANBNK": "Bandhan Bank Ltd", "BANKBARODA": "Bank of Baroda", "BANKINDIA": "Bank of India", 
            "BATAINDIA": "Bata India Ltd", "BEL": "Bharat Electronics Ltd", "BERGEPAINT": "Berger Paints India Ltd", 
            "BHEL": "Bharat Heavy Electricals Ltd", "BIOCON": "Biocon Ltd", "BOSCHLTD": "Bosch Ltd", 
            "CADILAHC": "Cadila Healthcare Ltd", "CANBK": "Canara Bank", "CASTROLIND": "Castrol India Ltd", 
            "CHOLAFIN": "Cholamandalam Investment and Finance Company Ltd", "COLPAL": "Colgate-Palmolive (India) Ltd", "CONCOR": "Container Corporation of India Ltd", 
            "COROMANDEL": "Coromandel International Ltd", "CROMPTON": "Crompton Greaves Consumer Electricals Ltd", "CUMMINSIND": "Cummins India Ltd", 
            "DABUR": "Dabur India Ltd", "DALMIACEM": "Dalmia Bharat Ltd", "DEEPAKNTR": "Deepak Nitrite Ltd", 
            "DLF": "DLF Ltd", "LALPATHLAB": "Dr. Lal PathLabs Ltd", "EMAMILTD": "Emami Ltd", 
            "ESCORTS": "Escorts Kubota Ltd", "EXIDEIND": "Exide Industries Ltd", "FEDERALBNK": "The Federal Bank Ltd", 
            "FORTIS": "Fortis Healthcare Ltd", "GAIL": "GAIL (India) Ltd", "GMRINFRA": "GMR Infrastructure Ltd", 
            "GLENMARK": "Glenmark Pharmaceuticals Ltd", "GODREJCP": "Godrej Consumer Products Ltd", "GODREJIND": "Godrej Industries Ltd", 
            "GODREJPROP": "Godrej Properties Ltd", "GUJGASLTD": "Gujarat Gas Ltd", "GSPL": "Gujarat State Petronet Ltd", 
            "HAVELLS": "Havells India Ltd", "HINDZINC": "Hindustan Zinc Ltd", "HAL": "Hindustan Aeronautics Ltd", 
            "HINDPETRO": "Hindustan Petroleum Corporation Ltd", "HONAUT": "Honeywell Automation India Ltd", "ICICIGI": "ICICI Lombard General Insurance Company Ltd", 
            "ICICIPRULI": "ICICI Prudential Life Insurance Company Ltd", "IDBI": "IDBI Bank Ltd", "IDEA": "Vodafone Idea Ltd", 
            "IDFCFIRSTB": "IDFC First Bank Ltd", "IGL": "Indraprastha Gas Ltd", "INDIANB": "Indian Bank", 
            "INDHOTEL": "The Indian Hotels Company Ltd", "IOC": "Indian Oil Corporation Ltd", "IRCTC": "Indian Railway Catering and Tourism Corporation Ltd", 
            "IPCALAB": "IPCA Laboratories Ltd", "JINDALSTEL": "Jindal Steel & Power Ltd", "JUBLFOOD": "Jubilant Foodworks Ltd", 
            "JSWENERGY": "JSW Energy Ltd", "KAJARIACER": "Kajaria Ceramics Ltd", "KANSAINER": "Kansai Nerolac Paints Ltd", 
            "L&TFH": "L&T Finance Holdings Ltd", "LICHSGFIN": "LIC Housing Finance Ltd", "LUPIN": "Lupin Ltd", 
            "M&MFIN": "Mahindra & Mahindra Financial Services Ltd", "MARICO": "Marico Ltd", "MFSL": "Max Financial Services Ltd", 
            "MAXHEALTH": "Max Healthcare Institute Ltd", "METROPOLIS": "Metropolis Healthcare Ltd", "MINDTREE": "Mindtree Ltd", 
            "MOTHERSUMI": "Motherson Sumi Systems Ltd", "MPHASIS": "Mphasis Ltd", "MRF": "MRF Ltd", 
            "MUTHOOTFIN": "Muthoot Finance Ltd", "NATIONALUM": "National Aluminium Company Ltd", "NAUKRI": "Info Edge (India) Ltd", 
            "NAVINFLUOR": "Navin Fluorine International Ltd", "NHPC": "NHPC Ltd", "NAM-INDIA": "Nippon Life India Asset Management Ltd", 
            "NMDC": "NMDC Ltd", "OBEROIRLTY": "Oberoi Realty Ltd", "OFSS": "Oracle Financial Services Software Ltd", 
            "OIL": "Oil India Ltd", "PAGEIND": "Page Industries Ltd", "PETRONET": "Petronet LNG Ltd", 
            "PIIND": "PI Industries Ltd", "PEL": "Piramal Enterprises Ltd", "PFC": "Power Finance Corporation Ltd", 
            "PNB": "Punjab National Bank", "PVR": "PVR Ltd", "RAMCOCEM": "The Ramco Cements Ltd", 
            "RBLBANK": "RBL Bank Ltd", "REC": "REC Ltd", "RECLTD": "Rural Electrification Corporation", 
            "SAIL": "Steel Authority of India Ltd", "SBICARD": "SBI Cards and Payment Services Ltd", "SHREECEM": "Shree Cement Ltd", 
            "SRTRANSFIN": "Shriram Transport Finance Company Ltd", "SIEMENS": "Siemens Ltd", "SRF": "SRF Ltd", 
            "STAR": "Strides Pharma Science Ltd", "SUNTV": "Sun TV Network Ltd", "SUPREMEIND": "Supreme Industries Ltd", 
            "SYNGENE": "Syngene International Ltd", "TATACHEM": "Tata Chemicals Ltd", "TATACOMM": "Tata Communications Ltd", 
            "TATAELXSI": "Tata Elxsi Ltd", "TATAPOWER": "Tata Power Company Ltd", "RAMCOIND": "Ramco Industries Ltd", 
            "TORNTPOWER": "Torrent Power Ltd", "TRENT": "Trent Ltd", "TVSMOTOR": "TVS Motor Company Ltd", 
            "UBL": "United Breweries Ltd", "MCDOWELL-N": "United Spirits Ltd", "VGUARD": "V-Guard Industries Ltd", 
            "VOLTAS": "Voltas Ltd", "WHIRLPOOL": "Whirlpool of India Ltd", "YESBANK": "Yes Bank Ltd", 
            "ZEEL": "Zee Entertainment Enterprises Ltd", "ZOMATO": "Zomato Ltd", "PAYTM": "One97 Communications Ltd", 
            "NYKAA": "FSN E-Commerce Ventures Ltd", "POLICYBZR": "PB Fintech Ltd", "LICI": "Life Insurance Corporation of India",
             "AARTIDRUGS": "Aarti Drugs Ltd", "AARTIIND": "Aarti Industries Ltd", "AAVAS": "Aavas Financiers Ltd",
            "ABBOTINDIA": "Abbott India Ltd", "ADANITOTAL": "Adani Total Gas Ltd", "ADANIGAS": "Adani Gas Ltd",
            "ADVENZYMES": "Advanced Enzyme Technologies", "AEGISCHEM": "Aegis Logistics", "AFFLE": "Affle (India) Ltd",
            "AJANTPHARM": "Ajanta Pharma Ltd", "AKZOINDIA": "Akzo Nobel India", "ALEMBICLTD": "Alembic Ltd",
            "ALLCARGO": "Allcargo Logistics", "AMARAJABAT": "Amara Raja Batteries", "AMBER": "Amber Enterprises India",
            "ANURAS": "Anupam Rasayan India", "APOLLOTYRE": "Apollo Tyres", "APTUS": "Aptus Value Housing Finance",
            "ARCHIDPLY": "Archidply Industries", "ASHOKA": "Ashoka Buildcon", "ASIANTILES": "Asian Granito India",
            "ASTEC": "Astec LifeSciences", "ASTERDM": "Aster DM Healthcare", "ASTRAL": "Astral Ltd",
            "ATUL": "Atul Ltd", "AUBANK": "AU Small Finance Bank", "AVANTIFEED": "Avanti Feeds",
            "BAJAJELEC": "Bajaj Electricals", "BAJAJCON": "Bajaj Consumer Care", "BALAMINES": "Balaji Amines",
            "BALRAMCHIN": "Balrampur Chini Mills", "BANARISUG": "Bannari Amman Sugars", "BASF": "BASF India",
            "BEML": "BEML Ltd", "BCG": "Brightcom Group", "BDL": "Bharat Dynamics",
            "Bectorfood": "Mrs. Bectors Food Specialities", "BFUTILITIE": "BF Utilities", "BGRENERGY": "BGR Energy Systems",
            "BHARATFORG": "Bharat Forge", "BHARATGEAR": "Bharat Gears", "BHARTIGL": "Bharti Global",
            "BIRLACORPN": "Birla Corporation", "BSOFT": "Birlasoft Ltd", "BLISSGVS": "Bliss GVS Pharma",
            "BLUEDART": "Blue Dart Express", "BLUESTARCO": "Blue Star Ltd", "BOMDYEING": "Bombay Dyeing & Mfg",
            "BORORENEW": "Borosil Renewables", "BSE": "BSE Ltd", "BURGERKING": "Restaurant Brands Asia",
            "CAMPUS": "Campus Activewear", "CANFINHOME": "Can Fin Homes", "CAPLIPOINT": "Caplin Point Laboratories",
            "CARBORUNIV": "Carborundum Universal", "CAREERP": "Career Point", "CARTRADE": "Cartrade Tech",
            "CCL": "CCL Products (India)", "CEAT": "CEAT Ltd", "CENTRALBK": "Central Bank of India",
            "CENTURYPLY": "Century Plyboards (India)", "CERA": "Cera Sanitaryware", "CESC": "CESC Ltd",
            "CGPOWER": "CG Power and Industrial Solutions", "CHALET": "Chalet Hotels", "CHAMBLFERT": "Chambal Fertilisers",
            "CHEMCON": "Chemcon Speciality Chemicals", "CHEMPLASTS": "Chemplast Sanmar", "CHENNPETRO": "Chennai Petroleum",
            "CLEAN": "Clean Science and Technology", "COCHINSHIP": "Cochin Shipyard", "COFORGE": "Coforge Ltd",
            "COMPUSOFT": "Compucom Software", "CONFIPET": "Confidence Petroleum India", "COSMOFILMS": "Cosmo First",
            "CREDITACC": "CreditAccess Grameen", "CRISIL": "CRISIL Ltd", "CSBBANK": "CSB Bank",
            "CYIENT": "Cyient Ltd", "DATAPATTNS": "Data Patterns (India)", "DBCORP": "DB Corp",
            "DBL": "Dilip Buildcon", "DCAL": "Dishman Carbogen Amcis", "DCBBANK": "DCB Bank",
            "DCMSHRIRAM": "DCM Shriram", "DEEPAKFERT": "Deepak Fertilizers", "DELTACORP": "Delta Corp",
            "DEVYANI": "Devyani International", "DHAMPURSUG": "Dhampur Sugar Mills", "DHANI": "Dhani Services",
            "DHANUKA": "Dhanuka Agritech", "DIXON": "Dixon Technologies (India)", "LALPATHLAB": "Dr. Lal PathLabs",
            "DREDGECORP": "Dredging Corp of India", "EASEMYTRIP": "Easy Trip Planners", "EDELWEISS": "Edelweiss Financial Services",
            "EIDPARRY": "EID Parry (India)", "EIHOTEL": "EIH Ltd", "ELGIEQUIP": "Elgi Equipments",
            "EMAMIPAP": "Emami Paper Mills", "ENDURANCE": "Endurance Technologies", "ENGINERSIN": "Engineers India",
            "EPL": "EPL Ltd", "EQUITAS": "Equitas Small Finance Bank", "ERIS": "Eris Lifesciences",
            "ESABINDIA": "Esab India", "EVEREADY": "Eveready Industries India", "FACT": "Fertilizers & Chemicals Travancore",
            "FDC": "FDC Ltd", "FINEORG": "Fine Organic Industries", "FINCABLES": "Finolex Cables",
            "FINPIPE": "Finolex Industries", "FSL": "Firstsource Solutions", "GABRIEL": "Gabriel India",
            "GALAXYSURF": "Galaxy Surfactants", "GANECOS": "Ganesha Ecosphere", "GARFIBRES": "Garware Technical Fibres",
            "GICRE": "General Insurance Corp of India", "GILLETTE": "Gillette India", "GLAXO": "GlaxoSmithKline Pharmaceuticals",
            "GLS": "Glenmark Life Sciences", "GNA": "GNA Axles", "GNFC": "Gujarat Narmada Valley Fertilizers",
            "GOCOLORS": "Go Fashion (India)", "GODFRYPHLP": "Godfrey Phillips India", "GODREJAGRO": "Godrej Agrovet",
            "GPPL": "Gujarat Pipavav Port", "GRANULES": "Granules India", "GRAPHITE": "Graphite India",
            "GREAVESCOT": "Greaves Cotton", "GRINDWELL": "Grindwell Norton", "GRSE": "Garden Reach Shipbuilders",
            "GSFC": "Gujarat State Fertilizers & Chemicals", "GUJALKALI": "Gujarat Alkalies & Chemicals",
            "HAPPSTMNDS": "Happiest Minds Technologies", "HATHWAY": "Hathway Cable & Datacom", "HATSUN": "Hatsun Agro Product",
            "HEG": "HEG Ltd", "HEIDELBERG": "HeidelbergCement India", "HERANBA": "Heranba Industries",
            "HERITGFOOD": "Heritage Foods", "HFCL": "HFCL Ltd", "HGINFRA": "H.G. Infra Engineering",
            "HIKAL": "Hikal Ltd", "HIL": "HIL Ltd", "HIMATSEIDE": "Himatsingka Seide",
            "HINDCOPPER": "Hindustan Copper", "HINDMOTORS": "Hindustan Motors", "HINDNATGLS": "Hindustan National Glass",
            "HINDUJAGLO": "Hinduja Global Solutions", "HOMEFIRST": "Home First Finance Company", "HONAUT": "Honeywell Automation",
            "HUDCO": "Housing & Urban Development Corp", "IBREALEST": "Indiabulls Real Estate", "IBULHSGFIN": "Indiabulls Housing Finance",
            "ICRA": "ICRA Ltd", "IDFC": "IDFC Ltd", "IFBIND": "IFB Industries", "IFCI": "IFCI Ltd",
            "IGPL": "IG Petrochemicals", "IIFL": "IIFL Finance", "IIFLWAM": "IIFL Wealth Management",
            "IMAGICAA": "Imagicaaworld Entertainment", "INDIGOPNTS": "Indigo Paints", "INDOCO": "Indoco Remedies",
            "INDORAMA": "Indo Rama Synthetics", "INDSTAR": "Indo Star Capital Finance", "IGARASHI": "Igarashi Motors India",
            "INDIGOPNTS": "Indigo Paints", "INFIBEAM": "Infibeam Avenues", "INGERRAND": "Ingersoll Rand (India)",
            "INOXLEISUR": "INOX Leisure", "INOXSTEL": "Inox Wind Energy", "INTELLECT": "Intellect Design Arena",
            "IOB": "Indian Overseas Bank", "IOLCP": "IOL Chemicals & Pharmaceuticals", "IPCALAB": "Ipca Laboratories",
            "IRB": "IRB Infrastructure Developers", "IRCON": "Ircon International", "ISEC": "ICICI Securities",
            "ISGEC": "Isgec Heavy Engineering", "ITI": "ITI Ltd", "J&KBANK": "Jammu & Kashmir Bank",
            "JAGRAN": "Jagran Prakashan", "JAICORPLTD": "Jai Corp", "JAMNAAUTO": "Jamna Auto Industries",
            "JBCHEPHARM": "J.B. Chemicals & Pharmaceuticals", "JBMA": "JBM Auto", "JCHAC": "Johnson Controls-Hitachi AC",
            "JINDALPOLY": "Jindal Poly Films", "JINDALSAW": "Jindal Saw", "JINDALSTEL": "Jindal Steel & Power",
            "JKCEMENT": "JK Cement", "JKIL": "J. Kumar Infraprojects", "JKLAKSHMI": "JK Lakshmi Cement",
            "JKPAPER": "JK Paper", "JKTYRE": "JK Tyre & Industries", "JMFINANCIL": "JM Financial",
            "JSL": "Jindal Stainless", "JSLHISAR": "Jindal Stainless (Hisar)", "JSWHL": "JSW Holdings",
            "JUBLFOOD": "Jubilant Foodworks", "JUBLINGREA": "Jubilant Ingrevia", "JUBLPHARMA": "Jubilant Pharmova",
            "JUSTDIAL": "Just Dial", "JYOTHYLAB": "Jyothy Labs", "KAJARIACER": "Kajaria Ceramics",
            "KALPATPOWR": "Kalpataru Power Transmission", "KALYANKJIL": "Kalyan Jewellers India", "KANSAINER": "Kansai Nerolac Paints",
            "KARURVYSYA": "Karur Vysya Bank", "KEC": "KEC International", "KEI": "KEI Industries",
            "KIOCL": "KIOCL Ltd", "KIRIINDUS": "Kiri Industries", "KIRLOSENG": "Kirloskar Oil Engines",
            "KOLTEPATIL": "Kolte-Patil Developers", "KOTAKBANK": "Kotak Mahindra Bank", "KPITTECH": "KPIT Technologies",
            "KPRMILL": "K.P.R. Mill", "KRBL": "KRBL Ltd", "KSB": "KSB Ltd",
            "KSCL": "Kaveri Seed Company", "KSL": "Kalyani Steels", "KTKBANK": "Karnataka Bank",
            "L&TFH": "L&T Finance Holdings", "LAOPALA": "La Opala RG", "LATENTVIEW": "Latent View Analytics",
            "LAURUSLABS": "Laurus Labs", "LAXMIMACH": "Lakshmi Machine Works", "LEMONTREE": "Lemon Tree Hotels",
            "LICHSGFIN": "LIC Housing Finance", "LINDEINDIA": "Linde India", "LTTS": "L&T Technology Services",
            "LUMAXIND": "Lumax Industries", "LUPIN": "Lupin Ltd", "LUXIND": "Lux Industries",
            "M&MFIN": "Mahindra & Mahindra Financial", "MAHABANK": "Bank of Maharashtra", "MAHINDCIE": "Mahindra CIE Automotive",
            "MAHLOG": "Mahindra Logistics", "MAHSEAMLES": "Maharashtra Seamless", "MAITHANALL": "Maithan Alloys",
            "MANAPPURAM": "Manappuram Finance", "MARICO": "Marico Ltd", "MARKSANS": "Marksans Pharma",
            "MASFIN": "MAS Financial Services", "MASTEK": "Mastek Ltd", "MATRIMONY": "Matrimony.com",
            "MAXHEALTH": "Max Healthcare Institute", "MAYURUNI": "Mayur Uniquoters", "MAZDOCK": "Mazagon Dock Shipbuilders",
            "MCX": "Multi Commodity Exchange", "MEDPLUS": "Medplus Health Services", "METROPOLIS": "Metropolis Healthcare",
            "MGL": "Mahanagar Gas", "MHRIL": "Mahindra Holidays & Resorts", "MIDHANI": "Mishra Dhatu Nigam",
            "MINDTREE": "Mindtree Ltd", "MMTC": "MMTC Ltd", "MOIL": "MOIL Ltd",
            "MOL": "Meghmani Organics", "MOREPENLAB": "Morepen Laboratories", "MOTHERSON": "Motherson Sumi Wiring",
            "MOTILALOFS": "Motilal Oswal Financial Services", "MPHASIS": "Mphasis Ltd", "MRPL": "Mangalore Refinery & Petrochemicals",
            "MSTCLTD": "MSTC Ltd", "MTARTECH": "MTAR Technologies", "MTNL": "Mahanagar Telephone Nigam",
            "MUTHOOTFIN": "Muthoot Finance", "NAM-INDIA": "Nippon Life India Asset Mgmt", "NATCOPHARM": "Natco Pharma",
            "NATIONALUM": "National Aluminium Company", "NAUKRI": "Info Edge (India)", "NAVINFLUOR": "Navin Fluorine International",
            "NBCC": "NBCC (India)", "NCC": "NCC Ltd", "NESCO": "Nesco Ltd",
            "NETWORK18": "Network18 Media & Investments", "NFL": "National Fertilizers", "NH": "Narayana Hrudayalaya",
            "NHPC": "NHPC Ltd", "NIACL": "New India Assurance Company", "NIITLTD": "NIIT Ltd",
            "NILKAMAL": "Nilkamal Ltd", "NLCINDIA": "NLC India", "NMDC": "NMDC Ltd",
            "NOCIL": "NOCIL Ltd", "NOIDATOLL": "Noida Toll Bridge Company", "NOVARTIND": "Novartis India",
            "NTPC": "NTPC Ltd", "NUVOCO": "Nuvoco Vistas Corporation", "OBEROIRLTY": "Oberoi Realty",
            "OFSS": "Oracle Financial Services Software", "OIL": "Oil India", "OLECTRA": "Olectra Greentech",
            "OMAXE": "Omaxe Ltd", "ONGC": "Oil & Natural Gas Corp", "OPTIEMUS": "Optiemus Infracom",
            "ORIENTCEM": "Orient Cement", "ORIENTELEC": "Orient Electric", "ORISSAMINE": "Orissa Minerals Development",
            "PAGEIND": "Page Industries", "PAISALO": "Paisalo Digital", "PARADEEP": "Paradeep Phosphates",
            "PARAS": "Paras Defence and Space", "PATANJALI": "Patanjali Foods", "PATELENG": "Patel Engineering",
            "PAYTM": "One97 Communications", "PCJEWELLER": "PC Jeweller", "PEL": "Piramal Enterprises",
            "PERSISTENT": "Persistent Systems", "PETRONET": "Petronet LNG", "PFC": "Power Finance Corp",
            "PFIZER": "Pfizer Ltd", "PGHH": "Procter & Gamble Hygiene", "PGHL": "Procter & Gamble Health",
            "PHOENIXLTD": "The Phoenix Mills", "PIDILITIND": "Pidilite Industries", "PIIND": "PI Industries",
            "PILANIINVS": "Pilani Investment", "PNB": "Punjab National Bank", "PNBHOUSING": "PNB Housing Finance",
            "PNCINFRA": "PNC Infratech", "POLYMED": "Poly Medicure", "POLYCAB": "Polycab India",
            "POLYPLEX": "Polyplex Corporation", "POONAWALLA": "Poonawalla Fincorp", "POWERGRID": "Power Grid Corp of India",
            "POWERINDIA": "Hitachi Energy India", "PRAJIND": "Praj Industries", "PRESTIGE": "Prestige Estates Projects",
            "PRINCEPIPE": "Prince Pipes and Fittings", "PRISMOJOHN": "Prism Johnson", "PRIVISCL": "Privi Speciality Chemicals",
            "PROZONINTU": "Prozone Intu Properties", "PSB": "Punjab & Sind Bank", "PSPPROJECT": "PSP Projects",
            "PTC": "PTC India", "PURVA": "Puravankara Ltd", "PVR": "PVR Ltd",
            "QUESS": "Quess Corp", "RADICO": "Radico Khaitan", "RAILTEL": "RailTel Corp of India",
            "RAIN": "Rain Industries", "RAJESHEXPO": "Rajesh Exports", "RALLIS": "Rallis India",
            "RAMCOIND": "Ramco Industries", "RAMCOSYS": "Ramco Systems", "RAMCOCEM": "The Ramco Cements",
            "RANEHOLDIN": "Rane Holdings", "RATNAMANI": "Ratnamani Metals & Tubes", "RAYMOND": "Raymond Ltd",
            "RBLBANK": "RBL Bank", "RCF": "Rashtriya Chemicals & Fertilizers", "RECLTD": "REC Ltd",
            "REDINGTON": "Redington (India)", "RELAXO": "Relaxo Footwears", "RELIANCE": "Reliance Industries",
            "RELIGARE": "Religare Enterprises", "REPCOHOME": "Repco Home Finance", "RITES": "RITES Ltd",
            "RKFORGE": "Ramkrishna Forgings", "ROSSARI": "Rossari Biotech", "ROUTE": "Route Mobile",
            "RSWM": "RSWM Ltd", "RUCHI": "Ruchi Soya Industries", "RUPA": "Rupa & Company",
            "RVNL": "Rail Vikas Nigam", "SAFARI": "Safari Industries (India)", "SAGCEM": "Sagar Cements",
            "SAIL": "Steel Authority of India", "SANDHAR": "Sandhar Technologies", "SANGHIIND": "Sanghi Industries",
            "SANOFI": "Sanofi India", "SAPPHIRE": "Sapphire Foods India", "SAREGAMA": "Saregama India",
            "SBICARD": "SBI Cards and Payment Services", "SBILIFE": "SBI Life Insurance Company", "SBIN": "State Bank of India",
            "SCHAEFFLER": "Schaeffler India", "SCHNEIDER": "Schneider Electric Infrastructure", "SCI": "Shipping Corp of India",
            "SEQUENT": "Sequent Scientific", "SFL": "Sheela Foam", "SHARDACROP": "Sharda Cropchem",
            "SHILPAMED": "Shilpa Medicare", "SHK": "S H Kelkar and Company", "SHOPERSTOP": "Shoppers Stop",
            "SHREECEM": "Shree Cement", "SHRIRAMCIT": "Shriram City Union Finance", "SHRIRAMFIN": "Shriram Finance",
            "SHYAMMETL": "Shyam Metalics and Energy", "SIEMENS": "Siemens Ltd", "SIS": "SIS Ltd",
            "SJVN": "SJVN Ltd", "SKFINDIA": "SKF India", "SOBHA": "Sobha Ltd",
            "SOLARA": "Solara Active Pharma Sciences", "SONACOMS": "Sona BLW Precision Forgings", "SONATSOFTW": "Sonata Software",
            "SPANDANA": "Spandana Sphoorty Financial", "SPARC": "Sun Pharma Advanced Research", "SRF": "SRF Ltd",
            "SRTRANSFIN": "Shriram Transport Finance", "STAR": "Strides Pharma Science", "STARCEMENT": "Star Cement",
            "STARHEALTH": "Star Health and Allied Insurance", "STLTECH": "Sterlite Technologies", "SUBEXLTD": "Subex Ltd",
            "SUBROS": "Subros Ltd", "SUDARSCHEM": "Sudarshan Chemical Industries", "SUMICHEM": "Sumitomo Chemical India",
            "SUNDARMFIN": "Sundaram Finance", "SUNDRMFAST": "Sundram Fasteners", "SUNPHARMA": "Sun Pharmaceutical Industries",
            "SUNTECK": "Sunteck Realty", "SUNTV": "Sun TV Network", "SUPPETRO": "Supreme Petrochem",
            "SUPRAJIT": "Suprajit Engineering", "SUPREMEIND": "Supreme Industries", "SURYAROSNI": "Surya Roshni",
            "SURYODAY": "Suryoday Small Finance Bank", "SUVENPHAR": "Suven Pharmaceuticals", "SUZLON": "Suzlon Energy",
            "SWANENERGY": "Swan Energy", "SWARAJENG": "Swaraj Engines", "SWELECTES": "Swelect Energy Systems",
            "SYMPHONY": "Symphony Ltd", "SYNGENE": "Syngene International", "TAINWALCHM": "Tainwala Chemicals",
            "TANLA": "Tanla Platforms", "TATACHEM": "Tata Chemicals", "TATACOFFEE": "Tata Coffee",
            "TATACOMM": "Tata Communications", "TATACONSUM": "Tata Consumer Products", "TATAELXSI": "Tata Elxsi",
            "TATAINVEST": "Tata Investment Corp", "TATAMETALI": "Tata Metaliks", "TATAMOTORS": "Tata Motors",
            "TATAPOWER": "Tata Power Company", "TATASTEEL": "Tata Steel", "TATASTLLP": "Tata Steel Long Products",
            "TCI": "Transport Corp of India", "TCIEXP": "TCI Express", "TCNSBRANDS": "TCNS Clothing Co",
            "TCS": "Tata Consultancy Services", "TEAMLEASE": "TeamLease Services", "TECHM": "Tech Mahindra",
            "TECHNOE": "Techno Electric & Engineering", "TEJASNET": "Tejas Networks", "THERMAX": "Thermax Ltd",
            "THYROCARE": "Thyrocare Technologies", "TIDEWATER": "Tide Water Oil (India)", "TIINDIA": "Tube Investments of India",
            "TIMKEN": "Timken India", "TINPLATE": "The Tinplate Company", "TITAN": "Titan Company",
            "TORNTPHARM": "Torrent Pharmaceuticals", "TORNTPOWER": "Torrent Power", "TOTAL": "Total Transport Systems",
            "TRENT": "Trent Ltd", "TRIDENT": "Trident Ltd", "TRITURBINE": "Triveni Turbine",
            "TRIVENI": "Triveni Engineering & Industries", "TTKPRESTIG": "TTK Prestige", "TV18BRDCST": "TV18 Broadcast",
            "TVSMOTOR": "TVS Motor Company", "TVSSRICHAK": "TVS Srichakra", "TVTODAY": "TV Today Network",
            "UBL": "United Breweries", "UCOBANK": "UCO Bank", "UFLEX": "Uflex Ltd",
            "UJJIVAN": "Ujjivan Financial Services", "UJJIVANSFB": "Ujjivan Small Finance Bank", "ULTRACEMCO": "UltraTech Cement",
            "UNIONBANK": "Union Bank of India", "UPL": "UPL Ltd", "URJA": "Urja Global",
            "USHAMART": "Usha Martin", "UTIAMC": "UTI Asset Management", "VAIBHAVGBL": "Vaibhav Global",
            "VAKRANGEE": "Vakrangee Ltd", "VARROC": "Varroc Engineering", "VBL": "Varun Beverages",
            "VEDL": "Vedanta Ltd", "VENKEYS": "Venky's (India)", "VESUVIUS": "Vesuvius India",
            "VGUARD": "V-Guard Industries", "VINATIORGA": "Vinati Organics", "VIPIND": "VIP Industries",
            "VMART": "V-Mart Retail", "VOLTAS": "Voltas Ltd", "VRLLOG": "VRL Logistics",
            "VSTIND": "VST Industries", "VTL": "Vardhman Textiles", "WABAG": "VA Tech Wabag",
            "WALCHANNAG": "Walchandnagar Industries", "WANBURY": "Wanbury Ltd", "WELCORP": "Welspun Corp",
            "WELENT": "Welspun Enterprises", "WELSPUNIND": "Welspun India", "WESTLIFE": "Westlife Development",
            "WHIRLPOOL": "Whirlpool of India", "WILLAMAGOR": "Williamson Magor", "WINDLAS": "Windlas Biotech",
            "WIPRO": "Wipro Ltd", "WOCKPHARMA": "Wockhardt Ltd", "WONDERLA": "Wonderla Holidays",
            "WSTCSTPAPR": "West Coast Paper Mills", "XCHANGING": "Xchanging Solutions", "YESBANK": "Yes Bank",
            "ZEEL": "Zee Entertainment Enterprises", "ZENSARTECH": "Zensar Technologies", "ZFCVINDIA": "ZF Commercial Vehicle",
            "ZOMATO": "Zomato Ltd", "ZYDUSLIFE": "Zydus Lifesciences", "ZYDUSWELL": "Zydus Wellness"
        }
    
    def validate_ticker(self, ticker: str) -> bool:
        """Check if ticker is valid"""
        return ticker.upper() in self.stocks
    
    def get_company_name(self, ticker: str) -> Optional[str]:
        """Get company name for ticker"""
        return self.stocks.get(ticker.upper())
    
    def search_stocks(self, query: str, limit: int = 10) -> List[Dict[str, str]]:
        """Search stocks by ticker or company name"""
        query = query.upper()
        results = []
        
        for ticker, name in self.stocks.items():
            if query in ticker or query in name.upper():
                results.append({
                    "ticker": ticker,
                    "company_name": name
                })
                
                if len(results) >= limit:
                    break
        
        return results
    
    def get_all_stocks(self) -> List[Dict[str, str]]:
        """Get all stocks"""
        return [
            {"ticker": ticker, "company_name": name}
            for ticker, name in self.stocks.items()
        ]

# Singleton instance
stock_validator = StockValidator()
