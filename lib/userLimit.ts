import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";

export async function checkAndUpdateCopyLimit(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId);

  const now = new Date();
  const lastReset = new Date(user.lastReset);
  const monthDiff = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

  // reset monthly
  if (monthDiff) {
    user.copyCount = 0;
    user.lastReset = now;
    await user.save();
  }

  return {
    isPro: user.isPro,
    copyCount: user.copyCount,
    remaining: user.isPro ? Infinity : 5 - user.copyCount,
  };
}

export async function incrementCopyCount(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId);
  user.copyCount += 1;
  await user.save();
}