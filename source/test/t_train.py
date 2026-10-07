import asyncio
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/'
async def main():
    async with async_playwright() as pw:
        br=await pw.chromium.launch();pg=await br.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(B+'eleve.html');await pg.wait_for_timeout(500)
        await pg.screenshot(path=OUT+'t0_code.png')
        await pg.click('#go-train');await pg.wait_for_timeout(300)
        await pg.click('#tr-niv button[data-v="2nde"]');await pg.click('#tr-nq button[data-v="10"]');await pg.click('#tr-fmt button[data-v="mix"]')
        await pg.screenshot(path=OUT+'t1_setup.png')
        await pg.click('#tr-go');await pg.wait_for_timeout(500)
        for i in range(10):
            await pg.screenshot(path=OUT+'t2_q%d.png'%i)
            if await pg.is_visible('#q-wid'):
                for _ in range(8):
                    if await pg.locator('#q-wid [data-o="in"]').count(): await pg.locator('#q-wid [data-o="in"]').first.click();continue
                    if await pg.locator('#q-wid [data-s="L"]:not(.pd)').count():
                        await pg.locator('#q-wid [data-s="L"]:not(.pd)').first.click();await pg.locator('#q-wid [data-s="R"]:not(.pd)').first.click();continue
                    break
                await pg.click('#w-ok')
            elif await pg.is_visible('#q-free'):
                await pg.click('#kpad button[data-key="9"]');await pg.click('#kpad button.ok')
            else:
                await pg.click('#q-ans .ab[data-k="0"]')
            for t in (200,700,1600):
                await pg.wait_for_timeout(t if t==200 else t-200)
                if i==0: await pg.screenshot(path=OUT+'t3_rv%d_%d.png'%(i,t))
            await pg.click('#tr-next');await pg.wait_for_timeout(400)
        await pg.wait_for_timeout(800);await pg.screenshot(path=OUT+'t4_end.png',full_page=True)
        await pg.click('#end-carnet');await pg.wait_for_timeout(300);await pg.screenshot(path=OUT+'t5_carnet.png',full_page=True)
        print(errs or 'ok');await br.close()
asyncio.run(main())
