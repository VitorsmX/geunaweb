import UploadComponent from "@/components/uploader"

const mediaUploader = () => {
    return (
        <div className="grid place-items-center col-span-6 max-md:col-span-7 max-md:row-span-6 bg-slate-300 w-full h-screen overflow-y-scroll">
            <UploadComponent/>
        </div>
    )
}

export default mediaUploader