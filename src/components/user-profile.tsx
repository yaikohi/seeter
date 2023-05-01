import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserProfile({ imgUrl }: { imgUrl: string }) {
  return (
    <Avatar>
      <AvatarImage sizes="5" src={imgUrl} alt="Profile image" />
      <AvatarFallback>no avatar</AvatarFallback>
    </Avatar>
  );
}
