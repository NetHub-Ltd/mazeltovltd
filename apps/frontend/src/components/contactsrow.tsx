// import { TableCell, TableRow } from "@/components/ui/table";
import { Contact } from "@/schemas";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
// import { Contact } from "./types"; // or wherever your Contact type lives

interface ContactRowProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
}

const ContactRow = ({ contact, onEdit }: ContactRowProps) => {
  return (
    <TableRow className="group  transition-all duration-300 cursor-pointer border-transparent selected:bg-slate-100  hover:bg-blue-50">
      <TableCell className="">
        {contact.name}
      </TableCell>

      <TableCell className="truncate max-w-[200px]">
        {contact.email}
      </TableCell>

      <TableCell className="">
        {contact.address || "-"}
      </TableCell>

      <TableCell className=" text-gray-700">
        {contact.phone_number || "-"}
      </TableCell>

      <TableCell className=" text-gray-700">
        {contact.source || "-"}
      </TableCell>

      <TableCell className=" text-gray-700">
        {contact.tag || "-"}
      </TableCell>

      <TableCell className=" text-right">
        <Button
          type="button"
          onClick={() => onEdit?.(contact)}
          className="text-sm bg-slate-200 text-slate-600 hover:text-white  hover:bg-slate-400  hover:underline transition"
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ContactRow;

