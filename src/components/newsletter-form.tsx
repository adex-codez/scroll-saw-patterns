import { useState } from "react";

export function NewsletterForm() {
	const [formData, setFormData] = useState({ name: "", email: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isSubmitting) return;

		setIsSubmitting(true);
		setMessage(null);

		try {
			const response = await fetch("https://scrollsawbackend.onrender.com/api/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to subscribe");
			}

			setMessage({
				text: "Thank you for subscribing to our newsletter!",
				type: "success",
			});
			setFormData({ name: "", email: "" }); // Reset form
		} catch (error) {
			console.error("Subscription error:", error);
			setMessage({
				text:
					error instanceof Error
						? error.message
						: "An error occurred while subscribing",
				type: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full" id="newsletter-form">
			<div className="flex flex-col mb-8">
				<label htmlFor="name" className="mb-2 text-gray-700">
					Name
				</label>
				<input
					type="text"
					className="py-3 px-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="flex flex-col mb-6">
				<label htmlFor="email" className="mb-2 text-gray-700">
					Email Address
				</label>
				<input
					type="email"
					className="py-3 px-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
			</div>
			<button
				type="submit"
				className="w-full py-3 px-6 bg-secondary-400 hover:bg-secondary-500 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
			</button>
			{message && (
				<div
					className={`mt-4 p-3 rounded-md text-center ${
						message.type === "error"
							? "bg-red-100 text-red-700"
							: "bg-green-100 text-green-700"
					}`}
				>
					{message.text}
				</div>
			)}
		</form>
	);
}
