const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
const { readFileSync } = require("fs");
const { Solver } = require("2captcha-ts");
const express = require("express");
const app = express();

const solver = new Solver("e4b321a0d3f7fc79bff71602a8fb6802");
try {
  (async () => {
    const pathToExtension = require("path").join(__dirname, "2captcha-solver");
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      channel: "chrome",
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    let urlsCheck = "";

    const [page] = await browser.pages();

    function delay() {
      return new Promise(function (resolve) {
        setTimeout(resolve, Math.random() * (2500 - 500) + 500);
      });
    }

    function delay2() {
      return new Promise(function (resolve) {
        setTimeout(resolve, Math.random() * (8000 - 500) + 500);
      });
    }

    function delay3() {
      return new Promise(function (resolve) {
        setTimeout(resolve, 2000);
      });
    }
    const select2 = async () => {
      console.log("select 2 fun");
      await delay();
      await delay();
      await delay();
      console.log("select 2 fun2");
      const urlsToCheck = [
        "https://www.usvisascheduling.com/en-US/ofc-schedule/",
        "https://www.usvisascheduling.com/en-US/schedule/", // Add more URLs as needed
        "https://www.usvisascheduling.com/en-US/ofc-schedule/?reschedule=true",
      ];

      // Wait for the page to navigate to any of the specific URLs
      await page.waitForFunction(
        (urls) => urls.some((url) => window.location.href.includes(url)),
        {},
        urlsToCheck
      );
      urlsCheck = await page.url();
      console.log("Current URL:", urlsCheck);
      console.log("select 2 fun");
      await checkGreenday();
    };

    const checkGreenday = async () => {
      let isDialogHandled = false; // Flag to track if the dialog has been handled
      let shouldExitLoops = false;
      let elementFound = false;

      page.on("dialog", async (dialog) => {
        if (dialog.type() === "alert" && !isDialogHandled) {
          console.log("Alert message:", dialog.message());
          await dialog.dismiss(); // Dismiss the alert
          await page.reload();
          delay2();
          await page.reload();
          isDialogHandled = true; // Set the flag as handled
          shouldExitLoops = true;
        }
      });

      isDialogHandled = false;
      console.log("grennday");

      const targetSelector = ".greenday"; // Replace with your target element selector
      const nextButtonSelector = ".ui-icon-circle-triangle-e";
      // Flag to control the loop exit

      while2: while (!elementFound) {
        console.log(elementFound);
        if (shouldExitLoops) {
          console.log("Breaking out of the cities loop as element is found");
          break while2;
        }
        console.log("while loop");
        let cities = "";

        if (urlsCheck === "https://www.usvisascheduling.com/en-US/schedule/") {
          cities = [
            "c86af614-b0db-ec11-a7b4-001dd80234f6",
            "aebaf614-b0db-ec11-a7b4-001dd80234f6",
            "816af614-b0db-ec11-a7b4-001dd80234f6",
            "716af614-b0db-ec11-a7b4-001dd80234f6",
            "e66af614-b0db-ec11-a7b4-001dd80234f6",
          ];
        } else if (
          urlsCheck ===
          "https://www.usvisascheduling.com/en-US/schedule/?reschedule=true"
        ) {
          cities = [
            "c86af614-b0db-ec11-a7b4-001dd80234f6",
            "aebaf614-b0db-ec11-a7b4-001dd80234f6",
            "816af614-b0db-ec11-a7b4-001dd80234f6",
            "716af614-b0db-ec11-a7b4-001dd80234f6",
            "e66af614-b0db-ec11-a7b4-001dd80234f6",
          ];
        } else {
          cities = [
            "3f6bf614-b0db-ec11-a7b4-001dd80234f6",
            "436bf614-b0db-ec11-a7b4-001dd80234f6",
            // "466bf614-b0db-ec11-a7b4-001dd80234f6",
            "486bf614-b0db-ec11-a7b4-001dd80234f6",
            "4a6bf614-b0db-ec11-a7b4-001dd80234f6",
          ];
        }

        outerLoop: for (const city of cities) {
          if (shouldExitLoops) {
            break outerLoop;
          }
          console.log(`Checking elements for ${city}`);
          try {
            await page.waitForSelector("#post_select", { timeout: 120000 }); // waits for 5 seconds
            await page.select("#post_select", city);
            // proceed with your actions on the element
          } catch (e) {
            console.error("The element did not appear within 1 min");
          }

          await delay3();
          try {
            const maxAttempts = 2;
            let attempts = 0;
            const inputValue = await page.$eval(
              "input#datepicker",
              (el) => el.value
            );

            console.log(inputValue);

            if (inputValue === "Select Date") {
              await page.evaluate(() => {
                $("input#datepicker.form-control.hasDatepicker").datepicker(
                  "show"
                );
              });
              await delay3();
              while3: while (!elementFound && attempts < maxAttempts) {
                if (shouldExitLoops) {
                  break while3; // labeled break to exit the outer loop
                }
                const element = await page.$(targetSelector);
                if (element) {
                  console.log("Element exists!");
                  await page.click(targetSelector); // Make sure this is awaited
                  await delay(); // Ensure delay is awaited
                  console.log("clicking on radio button");
                  const radioSelector = 'input[type="radio"]';
                  await page.evaluate((selector) => {
                    document.querySelector(selector).click(); // Click the radio button
                  }, radioSelector);
                  console.log("clicking on submit button");

                  await page.click("input#submitbtn"); // Click the submit button
                  elementFound = true; // Set elementFound to true
                } else {
                  console.log("not found");

                  try {
                    await page.waitForSelector(nextButtonSelector);
                    await page.click(nextButtonSelector);
                    attempts++;
                  } catch (error) {
                    console.log(error);
                    attempts++;
                  }
                }
              }
            } else {
              console.log("Dates not loading");
              attempts++;
            }
          } catch (error) {
            break;
          }
          //   await page.evaluate(() => {
          //     $("input#datepicker.form-control.hasDatepicker").datepicker("show");
          //   });
          // }

          await page.evaluate(() => {
            $("input#datepicker.form-control.hasDatepicker").datepicker("hide");
          });
          if (elementFound) {
            console.log("Breaking out of the cities loop as element is found");
            break; // This breaks out of the cities loop
          }
        }
        if (shouldExitLoops) {
          select2();
          console.log("Breaking out of the cities loop as element is found");
        }
      }
    };
    const select1 = async () => {
      console.log("select fun");
      checkGreenday();
    };

    await page.setDefaultTimeout(420000); // 60 seconds for all actions
    page.goto(
      "https://atlasauth.b2clogin.com/f50ebcfb-eadd-41d8-9099-a7049d073f5c/b2c_1a_atoproduction_atlas_susi/oauth2/v2.0/authorize?client_id=607d08d6-b63b-4735-ad82-05dfcff7efa4&redirect_uri=https%3A%2F%2Fwww.usvisascheduling.com%2Fsignin-aad-b2c_1&response_type=code%20id_token&scope=openid&state=OpenIdConnect.AuthenticationProperties%3DumBPKYlJFySmHQT8m0oBPH1FPwfaXW32MGWAxyiybwC4qMko2kea0O5EPSbWHZF3IovAzH3KrmworAKbkEO4rySrv_wssx1cXv8LEphSKCQIac-IcoLkiL92uHeyKTrQZNpH9kUKlK3PLRpHR4twPvqqlEoXRQbX0-wes9inlv-0eSN4Lny_Zi7YiN73NiDt2iyV_GfC5bFf9IY5xlLYMmk1GJZG3kF3efOeykR43sU6yW6Ffs3VTbmJJAyxsT3k1akemeuOKKkNTN_U4KFoUjzmjmyGVWSvYiI3-QbTz6Nnk426uWaAc8u8pO9CoCYLAzQPZAjopuAfOfrORTGq6IpnEM0SGdRSD2zGdFhpdaNJGKMVNuGaCndHv_FX0Y8gwdOvyhBGsXBjgguYhfz6TgQCw4TpFbRKgYBmgWNbUwa3gl5SKQyyKScUC_ozBgpK&response_mode=form_post&nonce=638387582250941533.MjVhNDc4ZjItODdhZS00Njk0LWE5Y2ItZTc3ZTE3YTU1OWJlOTlkNmFlNjctNGUyMy00YmM2LWEwMDYtZDVmYjQzMTY0Yzhj&ui_locales=en-US&x-client-SKU=ID_NET461&x-client-ver=5.3.0.0"
    );

    const preloadFile = readFileSync("./inject.js", "utf8");
    await page.evaluateOnNewDocument(preloadFile);
    page.on("console", async (msg) => {
      const txt = msg.text();
      if (txt.includes("intercepted-params:")) {
        const params = JSON.parse(txt.replace("intercepted-params:", ""));
        console.log(params);

        try {
          console.log(`Solving the captcha...`);
          const res = await solver.cloudflareTurnstile(params);
          console.log(`Solved the captcha ${res.id}`);
          console.log(res);
          await page.evaluate((token) => {
            cfCallback(token);
          }, res.data);
        } catch (e) {
          console.log("here");
          console.log(e);
        }
      } else {
        return;
      }
    });

    const urlsToCheck = [
      "https://www.usvisascheduling.com/en-US/ofc-schedule/",
      "https://www.usvisascheduling.com/en-US/schedule/", // Add more URLs as needed
      // ...
    ];

    // Wait for the page to navigate to any of the specific URLs
    await page.waitForFunction(
      (urls) => urls.some((url) => window.location.href.includes(url)),
      {},
      urlsToCheck
    );
    urlsCheck = await page.url();
    console.log("Current URL:", urlsCheck);
    await select1();
  })();
} catch (error) {
  console.log(error);
}

app.listen(3300, () => {
  console.log("running on port 3300");
});
// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const { executablePath } = require("puppeteer");
// const { readFileSync } = require("fs");
// const { Solver } = require("2captcha-ts");

// const solver = new Solver("e4b321a0d3f7fc79bff71602a8fb6802");
// try {
//   (async () => {
//     const pathToExtension = require("path").join(__dirname, "2captcha-solver");
//     puppeteer.use(StealthPlugin());
//     const browser = await puppeteer.launch({
//       channel: "chrome",
//       headless: false,
//       args: [
//         `--disable-extensions-except=${pathToExtension}`,
//         `--load-extension=${pathToExtension}`,
//       ],
//       executablePath:
//         "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//       userDataDir:
//         "/Users/jyotirmaygaur/Library/Application Support/Google/Chrome/Profile 8",
//     });

//     const [page] = await browser.pages();
//     await page.setExtraHTTPHeaders({
//       accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
//       "accept-encoding": "gzip, deflate, br",
//       "accept-language": "en-US,en;q=0.9,en;q=0.8",
//     });

//     const checkGreenday = async () => {
//       console.log("grennday");
//       function delay(delay) {
//         return new Promise(function (resolve) {
//           setTimeout(resolve, Math.random() * (delay - 500) + 500);
//         });
//       }
//       const targetSelector = ".greenday"; // Replace with your target element selector
//       const nextButtonSelector = ".ui-icon-circle-triangle-e";
//       let elementFound = false;
//       while (!elementFound) {
//         console.log("while loop");
//         const cities = [
//           "3f6bf614-b0db-ec11-a7b4-001dd80234f6",
//           "436bf614-b0db-ec11-a7b4-001dd80234f6",
//           "466bf614-b0db-ec11-a7b4-001dd80234f6",
//           "486bf614-b0db-ec11-a7b4-001dd80234f6",
//           "4a6bf614-b0db-ec11-a7b4-001dd80234f6",
//         ]; // Replace with actual city names or URLs
//         // await page.select("#post_selector", "3f6bf614-b0db-ec11-a7b4-001dd80234f6");
//         // elementFound = true;
//         delay(12000);
//         for (const city of cities) {
//           console.log(`Checking elements for ${city}`);
//           const selector2 = "#post_select";
//           const rect = await page.evaluate((selector2) => {
//             const element = document.querySelector(selector2);
//             const { x, y } = element.getBoundingClientRect();
//             return { x, y };
//           }, selector2);
//           await page.mouse.move(rect.x, rect.y);
//           await page.mouse.click(rect.x, rect.y);
//           await delay(14000);
//           await page.select("#post_select", city);

//           await delay(12000);

//           const maxAttempts = 1;
//           let attempts = 0;
//           const inputValue = await page.$eval(
//             "input#datepicker",
//             (el) => el.value
//           );

//           console.log(inputValue);
//           if (inputValue === "Select Date") {
//             await delay();
//             const selector = "#datepicker";
//             const rect = await page.evaluate((selector) => {
//               const element = document.querySelector(selector);
//               const { x, y } = element.getBoundingClientRect();
//               return { x, y };
//             }, selector);
//             await page.mouse.move(rect.x, rect.y);
//             await page.mouse.click(rect.x, rect.y);
//           } else {
//             console.log("Dates not loading");
//             attempts++;
//           }

//           //   await page.evaluate(() => {
//           //     $("input#datepicker.form-control.hasDatepicker").datepicker("show");
//           //   });
//           // }

//           await delay(8000);

//           await page.evaluate(() => {
//             $("input#datepicker.form-control.hasDatepicker").datepicker("hide");
//           });
//           if (elementFound) {
//             console.log("Breaking out of the cities loop as element is found");
//             break; // This breaks out of the cities loop
//           }
//         }
//         await delay(10000);

//         // setTimeout(loop, 3000);
//       }
//     };
//     const select1 = async () => {
//       console.log("select fun");
//       checkGreenday();
//     };

//     await page.setDefaultTimeout(420000); // 60 seconds for all actions
//     page.goto(
//       "https://atlasauth.b2clogin.com/f50ebcfb-eadd-41d8-9099-a7049d073f5c/b2c_1a_atoproduction_atlas_susi/oauth2/v2.0/authorize?client_id=607d08d6-b63b-4735-ad82-05dfcff7efa4&redirect_uri=https%3A%2F%2Fwww.usvisascheduling.com%2Fsignin-aad-b2c_1&response_type=code%20id_token&scope=openid&state=OpenIdConnect.AuthenticationProperties%3DumBPKYlJFySmHQT8m0oBPH1FPwfaXW32MGWAxyiybwC4qMko2kea0O5EPSbWHZF3IovAzH3KrmworAKbkEO4rySrv_wssx1cXv8LEphSKCQIac-IcoLkiL92uHeyKTrQZNpH9kUKlK3PLRpHR4twPvqqlEoXRQbX0-wes9inlv-0eSN4Lny_Zi7YiN73NiDt2iyV_GfC5bFf9IY5xlLYMmk1GJZG3kF3efOeykR43sU6yW6Ffs3VTbmJJAyxsT3k1akemeuOKKkNTN_U4KFoUjzmjmyGVWSvYiI3-QbTz6Nnk426uWaAc8u8pO9CoCYLAzQPZAjopuAfOfrORTGq6IpnEM0SGdRSD2zGdFhpdaNJGKMVNuGaCndHv_FX0Y8gwdOvyhBGsXBjgguYhfz6TgQCw4TpFbRKgYBmgWNbUwa3gl5SKQyyKScUC_ozBgpK&response_mode=form_post&nonce=638387582250941533.MjVhNDc4ZjItODdhZS00Njk0LWE5Y2ItZTc3ZTE3YTU1OWJlOTlkNmFlNjctNGUyMy00YmM2LWEwMDYtZDVmYjQzMTY0Yzhj&ui_locales=en-US&x-client-SKU=ID_NET461&x-client-ver=5.3.0.0"
//     );
//     const preloadFile = readFileSync("./inject.js", "utf8");
//     await page.evaluateOnNewDocument(preloadFile);
//     page.on("console", async (msg) => {
//       const txt = msg.text();
//       if (txt.includes("intercepted-params:")) {
//         const params = JSON.parse(txt.replace("intercepted-params:", ""));
//         console.log(params);

//         try {
//           console.log(`Solving the captcha...`);
//           const res = await solver.cloudflareTurnstile(params);
//           console.log(`Solved the captcha ${res.id}`);
//           console.log(res);
//           await page.evaluate((token) => {
//             cfCallback(token);
//           }, res.data);
//         } catch (e) {
//           console.log("here");
//           console.log(e);
//           return process.exit();
//         }
//       } else {
//         return;
//       }
//     });

//     const specificUrl = "https://www.usvisascheduling.com/en-US/ofc-schedule/";

//     // Wait for the page to navigate to the specific URL
//     await page.waitForFunction(
//       (url) => window.location.href.includes(url),
//       {},
//       specificUrl
//     );

//     await select1();
//   })();
// } catch (error) {
//   console.log(error);
// }
