RULES = [
    { 'cond': lambda raw: raw['travel_km'] > 20, 'text': 'Reduce long-distance travel – consider public transport.', 'severity': 'medium' },
    { 'cond': lambda raw: raw['electricity_kwh'] > 10, 'text': 'Electricity usage is high. Try switching to LED bulbs.', 'severity': 'high' }
]

def generate_recommendations(raw):
    out = []
    for r in RULES:
        try:
            if r['cond'](raw):
                out.append({'text': r['text'], 'severity': r['severity']})
        except:
            pass
    return out
