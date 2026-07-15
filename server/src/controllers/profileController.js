import { profileSchema } from "../validators/profileValidators.js";
import { serializeOwnUser } from "../serializers/userSerializers.js";

export function getProfile(req, res) {
  return res.json({ user: serializeOwnUser(req.user) });
}

export async function updateProfile(req, res) {
  const input = profileSchema.parse(req.body);
  req.user.firstName = input.firstName;
  req.user.lastName = input.lastName;
  req.user.communityName = input.communityName;
  req.user.contact = input.contact;
  await req.user.save();
  return res.json({ user: serializeOwnUser(req.user) });
}
