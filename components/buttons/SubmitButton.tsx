import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function SubmitButton() {
    return (
        <div className="flex justify-end p-4">
            <button className="bg-emerald-400 text-slate-50 text-lg rounded-md px-4 py-2 flex gap-2 items-center">
                <FontAwesomeIcon icon={faSave} />
                <span>Save</span>
            </button>
        </div>
    )
}
