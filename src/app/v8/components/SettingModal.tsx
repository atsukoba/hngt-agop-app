import { DetailedHTMLProps, HTMLAttributes, useRef } from "react";

export default function SettingModal({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  const modalDialogRef = useRef<HTMLDialogElement>(null);

  const handleModalOpen = () => {
    modalDialogRef.current?.showModal();
  };

  return (
    <>
      <button className="btn" onClick={handleModalOpen} {...props}>
        Settings
      </button>
      <dialog className="modal" ref={modalDialogRef}>
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
