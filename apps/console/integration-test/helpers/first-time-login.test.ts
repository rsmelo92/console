import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { OnboardingPage } from "../pages/onboarding.page";
import { PipelinesPage } from "../pages/pipelines.page";

test("should log in for the first time", async ({ page }) => {
  console.log(await page.context().cookies());
  
  const loginPage = new LoginPage(page);
  const onboardingPage = new OnboardingPage(page);
  const pipelinesPage = new PipelinesPage(page);

  await loginPage.goto();

  // Mock login response so we can trigger it everytime test runs
  // await page.route('*/**/auth/login', async route => {
  //   const json = { 
  //     "access_token": "123"
  //   };
  //   await route.fulfill({ json });
  // });
  // await page.route('*/**/auth/change_password', async route => {
  //   await route.fulfill();
  // });
  // await page.route('*/**/users/me', async route => {
  //   const json = { user };
  //   await route.fulfill({ json });
  // });
  // await page.route('*/**/api/get-user-cookie', async route => {
  //   await route.fulfill({ json: "{\"access_token\":\"123\"}" });
  // });
  // await page.route('*/**/auth/validate_access_token', async route => {
  //   await route.fulfill({ status: 200 });
  // });

  // Submit with default password
  await Promise.all([
    loginPage.expectOnChangePasswordView(),
    loginPage.loginWithDefaultPassword(),
  ]);

  // Change password
  await Promise.all([onboardingPage.expectOnIt(), loginPage.changePassword()]);

  // Fill in onboarding form
  await onboardingPage.goto();
  await onboardingPage.fillInOnboardingForm();
  await Promise.all([pipelinesPage.expectOnIt(), onboardingPage.submitForm()]);

  await page
    .context()
    .storageState({ path: "integration-test/.auth/user.json" });
});
