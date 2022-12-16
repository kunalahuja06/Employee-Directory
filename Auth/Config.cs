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
                    RedirectUris = new [] { "https://localhost:5002/signin-oidc" },
                    FrontChannelLogoutUri = "https://localhost:5002/signout-oidc",
                    PostLogoutRedirectUris = new [] { "https://localhost:5002/signout-callback-oidc" },
                    AllowedScopes = new [] { "openid", "profile", "EmployeeAPI.read" },
                    AllowOfflineAccess = true,
                    AllowPlainTextPkce = false,
                }
            };
    }
}
