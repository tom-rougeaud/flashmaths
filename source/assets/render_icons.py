import asyncio,base64
from playwright.async_api import async_playwright
svg=open('logo.svg').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        for size,name,bg in [(32,'fav32.png',None),(180,'apple180.png','#FFFFFF'),(512,'logo512.png',None),(256,'preview.png','#F6F4FF')]:
            await pg.set_viewport_size({'width':size,'height':size})
            pad=int(size*0.08) if bg else 0
            html='<html><body style="margin:0;background:%s"><div style="width:%dpx;height:%dpx;padding:%dpx;box-sizing:border-box">%s</div></body></html>'%(bg or 'transparent',size,size,pad,svg.replace('<svg ','<svg width="100%" height="100%" '))
            await pg.set_content(html)
            await pg.screenshot(path=name,omit_background=bg is None)
        await b.close()
asyncio.run(main())
