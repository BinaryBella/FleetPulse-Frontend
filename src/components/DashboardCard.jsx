export default function DashboardCard(props) {
    return (
        <div className="w-1/3 bg-[#2c2c59] rounded-lg shadow-md p-4 flex flex-col">
            <h1 className="text-gray-300 text-4xl font-bold mb-5">{props.title}</h1>
            <h1 className="text-gray-300 text-2xl">{props.subtitle}</h1>
            <div className="flex justify-end mt-auto">
                <img src={props.img} alt={props.subtitle} className="w-16 h-16 opacity-20" />
            </div>
        </div>
    );
}
