interface IFirebaseUser {
  kind: string;
  users: [
    {
      localId: string;
      email: string;
      displayName: string;
      photoUrl: string;
      emailVerified: boolean;
      providerUserInfo: [
        {
          providerId: string;
          displayName: string;
          photoUrl: string;
          federatedId: string;
          email: string;
          rawId: string;
        }
      ];
      validSince: string;
      lastLoginAt: string;
      createdAt: string;
      lastRefreshAt: string;
    }
  ];
}

export { IFirebaseUser };
