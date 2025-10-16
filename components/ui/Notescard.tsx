import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "next-view-transitions";
import { ArrowRightIcon } from "./icons/ArrowRightIcon";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineClass } from "react-icons/md";

interface Subject {
  id: string;
  name: string;
  user: {
    name: string;
  };
  department: {
    name: string;
  };
}

export default function NotesCard({
  subject
}: {
  subject: Subject;
}) {

  return (
    <Card className="relative h-[350px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[2px_2px_0px_0px_#757373] transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="space-y-3">
          <Link href={`/dashboard/files/${subject.id}`}>
            <CardTitle className="text-foreground group-hover:text-primary pr-20 text-xl leading-tight font-semibold transition-colors duration-200">
              {subject.name || "Untitled Subject"}
            </CardTitle>
          </Link>

          <CardDescription className="text-muted-foreground mt-2 text-sm leading-relaxed space-y-2">
            <div className="flex items-center">
              <FaUserAlt className="h-4 w-4 text-neutral-500 mr-2" />
              <span>Created by: {subject.user.name}</span>
            </div>
            <div className="flex items-center">
              <MdOutlineClass className="h-4 w-4 text-neutral-500 mr-2" />
              <span>Department: {subject.department.name}</span>
            </div>
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter className="absolute right-0 bottom-6 left-0 pt-4">
        <Link href={`/dashboard/files/${subject.id}`} className="w-full">
          <Button
            variant="default"
            className="border-primary/50 dark:border-secondary/50 w-full border-2 border-r-4 border-b-4 font-medium transition-all duration-200 hover:translate-x-0.5 hover:-translate-y-0.5 hover:cursor-pointer hover:border-r-2 hover:border-b-2"
          >
            View Subject Files
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
