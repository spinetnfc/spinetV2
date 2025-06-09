import { createProfileAction, getAllProfilesAction } from "@/actions/profile";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import { create } from "domain";

const HomePage = async () => {
  const user = await getUserCookieOnServer();
  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  const userId = user._id;
  const profiles = await getAllProfilesAction(userId);
  console.log("Profiles fetched:", profiles);
  return (
    <>
      <div>{profiles.length}</div>
      <h1 className="text-xl">
        {profiles.map(profile => (
          <div key={profile._id}>{profile._id}</div>
        ))}
      </h1>

    </>
  );
};
export default HomePage;
