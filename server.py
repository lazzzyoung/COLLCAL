# Crawling server

from fastapi import FastAPI, Query
import requests
from bs4 import BeautifulSoup

app = FastAPI()

@app.get("/crawl")
def crawl_webtoon(url: str = Query(...)):
    print(f"Crawling URL: {url}")

    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        print(soup)
        
        return {"status": "success", "data": soup.prettify()}
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": str(e)}
    
@app.get("/favicon.ico")
def favicon():
    return {"message": "Favicon not found"}