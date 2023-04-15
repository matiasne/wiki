function SuccessMessage({ message }: { message: string }) {
    return (
        <div className="bg-transparent border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">{message}</strong>
        </div>
    )
}

export default SuccessMessage