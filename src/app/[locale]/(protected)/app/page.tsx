import { createProfileAction, deleteProfileAction, getAllProfilesAction } from "@/actions/profile";
import { profileInput } from "@/types/profile";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import { json } from "stream/consumers";

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
          <div key={profile._id}>{JSON.stringify(profile, null, 2)}</div>
        ))}
      </h1>
    </>
  );
};

//   const data: profileInput = {
//     "status": 'none',
//     "profileName": "JohnDoePro",
//     "fullName": "John Doe",
//     "firstName": "John",
//     "lastName": "Doe",
//     "bio": "Experienced software engineer",
//     "phoneNumber": "+1234567890",
//     "website": "https://johndoe.com",
//     "birthDate": "1990-01-01",
//     "gender": "male",
//     "profession": "Software Engineer",
//     "links": [
//       {
//         "name": "LinkedIn",
//         "title": "Professional Profile",
//         "link": "https://linkedin.com/in/johndoe"
//       },
//       {
//         "name": "GitHub",
//         "title": "Code Repository",
//         "link": "https://github.com/johndoe"
//       }
//     ]
//   }
//   const response = await createProfileAction(userId, data);
//   console.log("Profile created:", response);
//   return null;
// };

//   const selectedProfile = "6846edc3f8ddaa17cef0cb62";
//   const response = await deleteProfileAction(selectedProfile);
//   console.log("Profile deleted:", response);
//   return (
//     <></>
//   )
// }
export default HomePage;
