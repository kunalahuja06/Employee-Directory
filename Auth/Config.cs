using IdentityServer4;
using IdentityServer4.Models;

namespace Auth
{
    public class Config
    {
    public static IEnumerable<IdentityResource> IdentityResources =>
        new []
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
            new IdentityResource
            {
                Name = "roles",
                UserClaims = new [] { "role" }
            }
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new[]
        {
            new ApiScope("EmployeeAPI.read"),
            new ApiScope("EmployeeAPI.write"),
        };

    public static IEnumerable<ApiResource> ApiResources =>
        new[]
        {
            new ApiResource("EmployeeAPI", "Employee API")
            {
                Scopes = new [] { "EmployeeAPI.read", "EmployeeAPI.write" },
                ApiSecrets = new [] { new Secret("secret".Sha256()) },
                UserClaims = new [] { "role" }
            }
        };

    public static IEnumerable<Client> Clients =>
        new[]
        {
            new Client
            {
                ClientId = "m2m.client",
                ClientName = "Client Credentials Client",
                AllowedGrantTypes = GrantTypes.ClientCredentials,
                ClientSecrets = { new Secret("ClientSecret".Sha256()) },
                AllowedScopes = new [] { "EmployeeAPI.read", "EmployeeAPI.write" }

            },
            new Client
            {
                ClientId = "interactive",
                ClientName = "Interactive Client",
                ClientSecrets={new Secret("secret1".Sha256())},
                AllowedGrantTypes = GrantTypes.Code,
                RequirePkce = true,
                RequireConsent = true,
                RedirectUris = new [] { "https://localhost:6001/employees" },
                FrontChannelLogoutUri = "https://localhost:6001/employees",
                PostLogoutRedirectUris = new [] { "https://localhost:4200" },
                AllowedScopes = new [] { "openid", "profile", "EmployeeAPI.read" },
                AllowOfflineAccess = true,
                AllowPlainTextPkce = false,
            },
            new Client
            {
                ClientName = "Angular-Client",
                ClientId = "angular-client",
                AllowedGrantTypes = GrantTypes.Code,
                RedirectUris = new List<string>{ "http://localhost:4200/signin-callback", "http://localhost:4200/assets/silent-callback.html" },
                RequirePkce = true,
                AllowAccessTokensViaBrowser = true,
                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "EmployeeAPI.read"
                },
                AllowedCorsOrigins = { "http://localhost:4200" },
                RequireClientSecret = false,
                PostLogoutRedirectUris = new List<string> { "http://localhost:4200/signout-callback" },
                RequireConsent = false,
                AccessTokenLifetime = 600
            },
        };
    }
}
