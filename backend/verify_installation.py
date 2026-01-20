"""
fIndia AI - Installation Verification Script
Checks if all components are properly installed and configured
"""

import sys
import os
from pathlib import Path

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def check_python_version():
    print("\n[1/10] Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Need 3.9+")
        return False

def check_dependencies():
    print("\n[2/10] Checking Python dependencies...")
    required = [
        'fastapi', 'uvicorn', 'motor', 'pymongo', 'transformers',
        'torch', 'yfinance', 'aiohttp', 'jwt', 'google.auth'
    ]
    
    missing = []
    for package in required:
        try:
            __import__(package.replace('.', '_'))
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - Missing")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
        return False
    return True

def check_model_files():
    print("\n[3/10] Checking FinBERT-India model...")
    model_path = Path(__file__).parent.parent / "models" / "finbert-india"
    
    required_files = [
        "config.json",
        "model.safetensors",
        "tokenizer.json",
        "vocab.txt"
    ]
    
    all_present = True
    for file in required_files:
        file_path = model_path / file
        if file_path.exists():
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - Missing")
            all_present = False
    
    if not all_present:
        print(f"\n⚠️  Model files missing in: {model_path}")
        return False
    return True

def check_env_file():
    print("\n[4/10] Checking environment configuration...")
    env_path = Path(__file__).parent / ".env"
    
    if env_path.exists():
        print(f"✅ .env file exists")
        
        # Check critical variables
        with open(env_path) as f:
            content = f.read()
            
        required_vars = ['MONGODB_URI', 'JWT_SECRET_KEY']
        for var in required_vars:
            if var in content and not content.split(var)[1].split('\n')[0].strip() == '=':
                print(f"✅ {var} is set")
            else:
                print(f"⚠️  {var} needs to be configured")
        
        return True
    else:
        print(f"❌ .env file not found")
        print("Run: cp .env.example .env")
        return False

def check_mongodb():
    print("\n[5/10] Checking MongoDB connection...")
    try:
        from pymongo import MongoClient
        from pymongo.errors import ConnectionFailure
        
        # Try to connect
        client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        print("✅ MongoDB is running and accessible")
        client.close()
        return True
    except ConnectionFailure:
        print("❌ MongoDB connection failed")
        print("Make sure MongoDB is running: mongod")
        return False
    except Exception as e:
        print(f"⚠️  Could not check MongoDB: {e}")
        return False

def check_finbert_loading():
    print("\n[6/10] Checking FinBERT model loading...")
    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        
        model_path = Path(__file__).parent.parent / "models" / "finbert-india"
        
        print("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(str(model_path))
        print("✅ Tokenizer loaded")
        
        print("Loading model...")
        model = AutoModelForSequenceClassification.from_pretrained(str(model_path))
        print("✅ Model loaded")
        
        print("Testing inference...")
        from transformers import pipeline
        sentiment = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
        result = sentiment("Reliance Industries reports strong quarterly earnings")[0]
        print(f"✅ Inference works: {result['label']} ({result['score']:.2f})")
        
        return True
    except Exception as e:
        print(f"❌ FinBERT loading failed: {e}")
        return False

def check_stock_validator():
    print("\n[7/10] Checking stock validator...")
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from services.stock_validator import stock_validator
        
        # Test validation
        if stock_validator.validate_ticker("RELIANCE"):
            print("✅ Stock validation works")
            print(f"   Loaded {len(stock_validator.stocks)} Indian stocks")
            return True
        else:
            print("❌ Stock validation failed")
            return False
    except Exception as e:
        print(f"❌ Stock validator error: {e}")
        return False

def check_api_endpoints():
    print("\n[8/10] Checking API structure...")
    
    routers_path = Path(__file__).parent / "routers"
    required_routers = ['auth.py', 'search.py', 'sentiment.py', 'watchlist.py', 'chat.py']
    
    all_present = True
    for router in required_routers:
        router_path = routers_path / router
        if router_path.exists():
            print(f"✅ {router}")
        else:
            print(f"❌ {router} - Missing")
            all_present = False
    
    return all_present

def check_services():
    print("\n[9/10] Checking services...")
    
    services_path = Path(__file__).parent / "services"
    required_services = [
        'database.py', 'finbert_service.py', 'news_service.py',
        'stock_validator.py', 'stock_data_service.py'
    ]
    
    all_present = True
    for service in required_services:
        service_path = services_path / service
        if service_path.exists():
            print(f"✅ {service}")
        else:
            print(f"❌ {service} - Missing")
            all_present = False
    
    return all_present

def check_frontend():
    print("\n[10/10] Checking frontend...")
    
    frontend_path = Path(__file__).parent.parent / "frontend"
    
    # Check package.json
    if (frontend_path / "package.json").exists():
        print("✅ package.json exists")
    else:
        print("❌ package.json missing")
        return False
    
    # Check src files
    src_path = frontend_path / "src"
    required_files = ['App.tsx', 'api.ts', 'AuthContext.tsx', 'Chatbot.tsx', 'index.css']
    
    all_present = True
    for file in required_files:
        if (src_path / file).exists():
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - Missing")
            all_present = False
    
    return all_present

def main():
    print_header("fIndia AI - Installation Verification")
    print("\nThis script will verify your installation is complete and ready.")
    
    results = []
    
    results.append(("Python Version", check_python_version()))
    results.append(("Dependencies", check_dependencies()))
    results.append(("Model Files", check_model_files()))
    results.append(("Environment Config", check_env_file()))
    results.append(("MongoDB", check_mongodb()))
    results.append(("FinBERT Loading", check_finbert_loading()))
    results.append(("Stock Validator", check_stock_validator()))
    results.append(("API Endpoints", check_api_endpoints()))
    results.append(("Services", check_services()))
    results.append(("Frontend", check_frontend()))
    
    # Summary
    print_header("Verification Summary")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\nPassed: {passed}/{total}")
    print("\nResults:")
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {name}")
    
    if passed == total:
        print("\n" + "=" * 60)
        print("  🎉 ALL CHECKS PASSED!")
        print("  Your fIndia AI installation is ready!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Start MongoDB: mongod")
        print("2. Start backend: python main.py")
        print("3. Start frontend: cd ../frontend && npm run dev")
        print("4. Visit: http://localhost:3000")
    else:
        print("\n" + "=" * 60)
        print("  ⚠️  SOME CHECKS FAILED")
        print("  Please fix the issues above before running the app.")
        print("=" * 60)
        print("\nRefer to QUICKSTART.md for setup instructions.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
