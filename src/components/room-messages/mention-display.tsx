import { Dispatch, SetStateAction } from "react";
import { GitHubUserEnriched } from "@/types/github";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Command, CommandEmpty, CommandItem, CommandList } from "../ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


interface MentionDisplayProps {
    searchResults: GitHubUserEnriched[];
    setMessage: Dispatch<React.SetStateAction<string>>;
    message: string;
    setShowMentions: Dispatch<SetStateAction<boolean>>;
}

export function MentionDisplay({ searchResults, setMessage, message, setShowMentions }: MentionDisplayProps) {
  return (
  <div className="absolute bottom-16 left-4 w-64 z-50">
    <Command>
      <CommandList>
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <CommandItem
              key={user.id}
              onSelect={() => {
                const newVal = message.replace(
                  /@[\w]*$/,
                  `@${user.username} `
                );
                setMessage(newVal);
                setShowMentions(false);
              }}
            >
              <Avatar className="w-5 h-5 mr-2">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} />
                ) : (
                  <AvatarFallback><FontAwesomeIcon icon={faUser} /></AvatarFallback>
                )}
              </Avatar>
              <span>{user.name}</span>
              <span className="ml-auto text-muted-foreground">@{user.username}</span>
            </CommandItem>
          ))
        ) : (
          <CommandEmpty>No users found</CommandEmpty>
        )}
      </CommandList>
    </Command>
  </div>
  )
}