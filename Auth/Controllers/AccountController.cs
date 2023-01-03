namespace Auth.Controllers
{
    using Auth.Data;
    using Auth.Models;
    using IdentityModel;
    using IdentityServer4.Services;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;

    namespace IdentityServer.Core.Controllers
    {
        [AllowAnonymous]
        public class AccountController : Controller
        {
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly SignInManager<ApplicationUser> _signInManager;
            private readonly IIdentityServerInteractionService _interaction;

            public AccountController(
                UserManager<ApplicationUser> userManager,
                SignInManager<ApplicationUser> signInManager,
                IIdentityServerInteractionService interaction)
            {
                _userManager = userManager;
                _signInManager = signInManager;
                _interaction = interaction;
            }

            [HttpGet]
            public async Task<IActionResult> Login(string returnUrl)
            {
                var externalProviders = await _signInManager.GetExternalAuthenticationSchemesAsync();
                return View(new LoginViewModel { ReturnUrl=returnUrl, ExternalProviders=externalProviders});
            }

            [HttpPost]
            public async Task<IActionResult> Login(LoginViewModel model)
            {
                // check if we are in the context of an authorization request
                var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);

                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);
					if(user!=null)
                    {
						var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberLogin, lockoutOnFailure: true);
						if (result.Succeeded)
						{
							if (context != null)
							{
								// we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
								return Redirect(model.ReturnUrl);
							}

							// request for a local page
							if (Url.IsLocalUrl(model.ReturnUrl))
							{
								return Redirect(model.ReturnUrl);
							}
							else if (string.IsNullOrEmpty(model.ReturnUrl))
							{
								return Redirect("~/");
							}
							else
							{
								// user might have clicked on a malicious link - should be logged
								throw new Exception("invalid return URL");
							}
						}
						else
						{
							ModelState.AddModelError(string.Empty, "Invalid credentials");
						}
					}
                    else
                    {
						ModelState.AddModelError(string.Empty, "Invalid credentials");
					}
                }

                return View(model);
            }

            [HttpGet]
            public async Task<IActionResult> Logout(string logoutId)
            {
                if (User?.Identity.IsAuthenticated == true)
                {
                    // delete local authentication cookie
                    await _signInManager.SignOutAsync();
                }

                var logout = await _interaction.GetLogoutContextAsync(logoutId);

                return Redirect(logout.PostLogoutRedirectUri);
            }

            [HttpGet]
            public IActionResult Register()
            {
                return View();
            }

            [HttpPost]
            public async Task<IActionResult> Register(RegisterViewModel model)
            {
                var user = new ApplicationUser
                {
					UserName = model.UserName,
					Email = model.Email,
                    EmailConfirmed = true,
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    throw new Exception(result.Errors.First().Description);
                }

                result = await _userManager.AddClaimsAsync(user, new Claim[]{
                            new Claim(JwtClaimTypes.Email, model.Email),
							new Claim(JwtClaimTypes.PreferredUserName, model.UserName),
							new Claim(JwtClaimTypes.Role,"user"),
						});

                if (!result.Succeeded)
                {
                    throw new Exception(result.Errors.First().Description);
                }
                return View("RegistrationSuccess");
            }
			
			public async Task<IActionResult> ExternalLogin(string provider, string returnUrl)
            {
			    // build a return URL so the external provider will redirect back
			    // to us after the user has logged in
			    var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { returnUrl });
			    var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
			    return Challenge(properties, provider);
            }
            public async Task<IActionResult> ExternalLoginCallback(string returnUrl)
            {
                var info = await _signInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return RedirectToAction("Login");
                }

                // Sign in the user with this external login provider if the user already has a login.
                var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);
                if (result.Succeeded)
                {
                    return Redirect(returnUrl);
                }
                return View("ExternalRegister", new ExternalRegisterViewModel
                {
                    Email = info.Principal.FindFirst(ClaimTypes.Email).Value,
                    Username = info.Principal.FindFirst(ClaimTypes.Name.Replace(" ", "_")).Value,
					ReturnUrl = returnUrl,
				});
			}
			
			public async Task<IActionResult> ExternalRegister(ExternalRegisterViewModel vm)
            {
				var info = await _signInManager.GetExternalLoginInfoAsync();
				if (info == null)
				{
					return RedirectToAction("Login");
				}

				var user = new ApplicationUser
				{
					UserName = vm.Username,
                    Email =vm.Email,
					EmailConfirmed = true,
				};

				var result = await _userManager.CreateAsync(user);

				if (!result.Succeeded)
				{
					throw new Exception(result.Errors.First().Description);
				}
				result = await _userManager.AddClaimsAsync(user, new Claim[]{
							new Claim(JwtClaimTypes.PreferredUserName, vm.Username),
							new Claim(JwtClaimTypes.Role,"user"),
						});

				if (!result.Succeeded)
				{
					throw new Exception(result.Errors.First().Description);
				}

				result = await _userManager.AddLoginAsync(user, info);
				if (!result.Succeeded)
				{
					throw new Exception(result.Errors.First().Description);
				}

                await _signInManager.SignInAsync(user, isPersistent: false);
				
				return Redirect(vm.ReturnUrl);

			}
		}
    }
}
