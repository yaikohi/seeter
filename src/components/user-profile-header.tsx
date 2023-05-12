import Image from "next/image";
interface UserProfileHeaderProps {
  username: string;
  profileImageUrl: string;
  profileDescription?: string;
}
export function UserProfileHeader({
  username,
  profileDescription,
  profileImageUrl,
}: UserProfileHeaderProps) {
  return (
    <div className="flex place-items-center gap-4">
      <Image
        src={profileImageUrl}
        alt={`${username ? username : username ?? ""}'s profile picture`}
        height={80}
        width={80}
        className="max-h-[96px] max-w-[96px] rounded-full"
      />
      <div className="flex max-w-xs flex-col">
        <h1 className="text-xl font-bold tracking-tighter">
          {"@"}
          {username}
        </h1>
        {profileDescription && (
          <p className="text-sm font-light tracking-tight">
            {profileDescription}
          </p>
        )}
      </div>
    </div>
  );
}
