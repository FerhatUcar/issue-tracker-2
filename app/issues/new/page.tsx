"use client";

import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const NewIssuesPage = () => (
  <>
    <IssueForm />
  </>
);

export default NewIssuesPage;
