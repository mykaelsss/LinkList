import ForgotPassword from "@/components/forms/ForgotPassword";
import TiltImage from "@/components/dynamic/Image";

export default function Reset() {
    return (
        <div className="w-full mx-auto">
        <div className="
            container-login100
            w-full min-h-[100vh] flex flex-wrap
            justify-center items-center
            p-4">
            <div className="
                wrap-login100
                w-[960px] bg-slate-200 rounded-[10px]
                overflow-hidden flex flex-wrap justify-between
                pt-44 pr-32 pb-44 pl-24">
                <TiltImage />
                <ForgotPassword />
            </div>
        </div>
    </div>
    )

}
