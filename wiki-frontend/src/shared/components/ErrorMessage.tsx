function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="bg-transparent border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">{message}</strong>
        </div>
    )
}

export default ErrorMessage