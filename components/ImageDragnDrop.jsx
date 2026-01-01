"use client"; // for Next.js App Router
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/router";

export default function ImageListDnD({ imagePath, setImagePath }) {
   const router = useRouter();
   const { id } = router?.query;
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(imagePath);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setImagePath(items);
  };

const handleDelete = async (data) => {
  try {

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/image/delete-image`,
      {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          "Content-Type": "application/json",
        },
        data: { fileName: data.fileName, productId: id}, // axios DELETE body
      }
    );

    console.log("File deleted successfully:", response.data);

    // Update state after deletion
    setImagePath((prev) => prev.filter((img) => img.fileName !== data.fileName));

  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="images">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="divide-y-[1px] divide-gray-500 min-h-[40px]"
          >
            {imagePath.length > 0 ? (
              imagePath.map((data, index) => (
                <Draggable
                  key={data.fileName}
                  draggableId={String(data.fileName)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-4 relative">
                        <FontAwesomeIcon
                          icon={faImage}
                          className="text-3xl text-gray-500"
                        />
                        {data?.fileName}
                        <a
                          href={data?.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="absolute top-0 right-0 h-full w-full"></span>
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(data)
                        }
                      >
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-gray-500"
                        />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p className="text-slate-600 text-sm mb-5">No files</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
