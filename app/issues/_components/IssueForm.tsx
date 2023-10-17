import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Button, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";

type IssueForm = {
  title: string;
  description: string;
};
const IssueForm = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueForm>();

  const onSubmit = handleSubmit(async (data) => {
    await axios.post("/api/issues", data);
    router.push("/issues");
  });

  return (
    <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
      <TextField.Root>
        <TextField.Input placeholder="title" {...register("title")} />
      </TextField.Root>
      <Controller
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
        control={control}
        name="description"
      />

      <Button>Submit</Button>
    </form>
  );
};

export default IssueForm;
