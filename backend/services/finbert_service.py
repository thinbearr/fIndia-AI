"""
FinBERT-India Sentiment Analysis Service
Uses custom fine-tuned model for Indian financial news
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
from pathlib import Path
import os
from typing import Dict, List

class FinBERTService:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.sentiment_pipeline = None
        self.load_model()
    
    def load_model(self):
        """Load fine-tuned FinBERT-India model"""
        try:
            # Get project root (parent of backend)
            backend_dir = Path(__file__).parent.parent
            project_root = backend_dir.parent
            model_path = project_root / "models" / "finbert-india"
            
            print(f"📂 Loading FinBERT-India model from: {model_path}")
            
            if not model_path.exists():
                raise FileNotFoundError(f"Model not found at {model_path}")
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(str(model_path))
            self.model = AutoModelForSequenceClassification.from_pretrained(str(model_path))
            
            # Create sentiment analysis pipeline
            self.sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if torch.cuda.is_available() else -1
            )
            
            print("✅ FinBERT-India model loaded successfully")
            
        except Exception as e:
            print(f"❌ Error loading FinBERT model: {e}")
            raise
    
    def analyze_sentiment(self, text: str) -> Dict[str, any]:
        """
        Analyze sentiment of financial text
        Returns: {label: 'positive'/'negative'/'neutral', score: float}
        """
        try:
            result = self.sentiment_pipeline(text[:512])[0]  # Truncate to max length
            
            # Convert label to standardized format
            label = result['label'].lower()
            score = result['score']
            
            # Map to positive/negative with confidence
            if label in ['positive', 'label_2']:
                return {
                    'label': 'positive',
                    'score': score,
                    'confidence': score
                }
            elif label in ['negative', 'label_0']:
                return {
                    'label': 'negative',
                    'score': -score,  # Negative score
                    'confidence': score
                }
            else:  # neutral or label_1
                return {
                    'label': 'neutral',
                    'score': 0.0,
                    'confidence': score
                }
                
        except Exception as e:
            print(f"Error analyzing sentiment: {e}")
            return {
                'label': 'neutral',
                'score': 0.0,
                'confidence': 0.0,
                'error': str(e)
            }
    
    def analyze_batch(self, texts: List[str]) -> List[Dict[str, any]]:
        """Analyze sentiment for multiple texts"""
        return [self.analyze_sentiment(text) for text in texts]
    
    def aggregate_sentiment(self, sentiments: List[Dict[str, any]]) -> Dict[str, any]:
        """
        Aggregate multiple sentiment scores
        Returns overall sentiment classification
        """
        if not sentiments:
            return {
                'label': 'neutral',
                'total_score': 0.0,
                'positive_count': 0,
                'negative_count': 0,
                'neutral_count': 0
            }
        
        total_score = sum(s['score'] for s in sentiments)
        positive_count = sum(1 for s in sentiments if s['label'] == 'positive')
        negative_count = sum(1 for s in sentiments if s['label'] == 'negative')
        neutral_count = sum(1 for s in sentiments if s['label'] == 'neutral')
        
        # Classify based on aggregate score
        avg_score = total_score / len(sentiments) if sentiments else 0.0
        
        # Classify based on AVERAGE score (Normalized -1 to 1)
        # > 0.15 indicates reliable positive signal
        # < -0.15 indicates reliable negative signal
        if avg_score > 0.15:
            overall_label = 'bullish'
        elif avg_score < -0.15:
            overall_label = 'bearish'
        else:
            overall_label = 'neutral'
        
        return {
            'label': overall_label,
            'total_score': round(avg_score, 2), # Normalized score (-1 to 1)
            'cumulative_score': round(total_score, 2), # Sum of all scores
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'average_score': round(avg_score, 2)
        }

# Singleton instance
finbert_service = FinBERTService()
