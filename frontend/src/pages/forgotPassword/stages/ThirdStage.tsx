import { Link } from "react-router-dom"

function ThirdStage(){
    return (
        <div className="min-h-full flex items-center justify-center pt-12 pb-3 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <img className="mx-auto h-24 w-auto" src="/boc-orange.png" alt="boc logo" />
                    <h2 className="mt-6 text-center text-3xl font-sans">CONGRATULATIONS!</h2>
                    <h3 className="mt-2 text-center text-xl font-sans">Your password has been successfully changed</h3>
                </div>
                <div>
                    <Link to={"/"}>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#dc9f61] hover:bg-[#d48e3c]">
                        Back to Login
                    </button>
                    </Link>
                </div>
            </div>
        </div>
        )
}

export default ThirdStage