import { SlidersHorizontalIcon } from "lucide-react";

const AdvancedCMSMenu = () => {
  return (
    <div className="grid place-items-center col-span-6 max-md:col-span-7 bg-slate-300 w-full h-screen max-md:row-span-6">
      <div className="flex justify-center items-center p-32 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full bg-slate-900">
        <div className="flex flex-col gap-y-4 justify-center items-center scale-90 max-sm:scale-[0.6] text-slate-200">
          <h1
            className="text-center text-3xl font-bold"
            style={{ textWrap: "nowrap" }}
          >
            Bem vindo ao CMS
          </h1>
          <SlidersHorizontalIcon
            width={50}
            height={50}
            size={50}
            stroke="white"
            fill="white"
          />
          <h2 className="text-center text-lg font-light underline underline-offset-4">
            Selecione uma das opções
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCMSMenu;
