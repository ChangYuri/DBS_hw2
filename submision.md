https://dbs-hw2.vercel.app/
https://github.com/ChangYuri/DBS_hw2/tree/main

1. 
- In CLAUDE.md, it has several different parts, all emphasizing the special feature or structure of the app. First is some important notices for future possible development. This is due to the problems we met during developing the app. The markdown basically says to go refer the official doc if meet these problems again, including fetching cache, using client etc.
- It then gives commands of how to run the app locally. It provides the detail of how the data is saved. It provides the use of external API and the structure of the endpoints. While developing we also adjusted the mood section, making us to explain it a little more.
- While we continue developing it, it CLAUDE.md also self-adjusted.


2.
- Route: /analysis  
  File that renders it: src/app/analysis/page.tsx                   
  Components: None — everything is written inline in that one file. No separate components imported.      
  Where the data comes from:               
  1. Page loads in the browser                
  2. Calls getAllEntries() from src/lib/localStorage.ts                    
  3. That function scans  browser's localStorage for every key matching diary-YYYY-MM-DD
  4. Parses each one as a diary entry and returns them all
  5. The page computes stats and draws the chart from that list — no server, no API 


3.
- Playwright browser repeatedly closing**: `"Target page, context or browser has been closed"` error persisted. I think this was because some bug, after I restart Claude it went ok again.

- This is the return from Claude:

```
Main page — typed a diary entry, picked "Happy" mood, hit Save → "All changes saved" appeared instantly. All good.             
Analysis — showed 3 total entries, 100 words, 33 avg words/entry, 3-day streak. The 14-day mood chart lit up yellow (Happy) on Apr 5 and Apr 7. Mood distribution showed Happy at 100%.                                   
Mood Calendar — April 2026 calendar with Apr 5 and Apr 7 highlighted in yellow with a 😊 emoji. Today (Apr 7) has a bold border. Clean and readable.                               
Search — typed "coffee", instantly found 2 entries with the word highlighted in yellow. Live search works perfectly.                      
The app is fully functional. No crashes, no broken pages.  
The Playwright MCP works so well that it basically simulates how a human would interact a website.
```

 Before, I had to use tools to record my movement and change it to a script and run it as a test. Now claude knows how to do it.