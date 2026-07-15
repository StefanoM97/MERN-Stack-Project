export function serializeOwnUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    schoolDomain: user.schoolDomain,
    communityName: user.communityName,
    contact: {
      emailVisible: user.contact?.emailVisible ?? true,
      phone: user.contact?.phone || "",
      phoneVisible: user.contact?.phoneVisible ?? false,
      preferredContact: user.contact?.preferredContact || "email"
    },
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function serializePublicUser(user) {
  const result = {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    schoolDomain: user.schoolDomain,
    communityName: user.communityName,
    preferredContact: user.contact?.preferredContact || "email"
  };

  if (user.contact?.emailVisible !== false) result.email = user.email;
  if (user.contact?.phoneVisible && user.contact?.phone) result.phone = user.contact.phone;
  return result;
}
