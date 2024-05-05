import Chat, { MessageProps, useMessages, Flex, toast } from "@chatui/core";
import "@chatui/core/dist/index.css";
import "@/chatui-theme.css";
import "highlight.js/styles/atom-one-dark.css";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
import CopyButton from "@/components/CopyButton";
import format from "rehype-format";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Terminal } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/outline";
function AiChat() {
	const { messages, appendMsg, setTyping } = useMessages([]);
	const [APIKEY, changeAPIKEY] = useState("");
	const [temperature, changeTemperature] = useState(0.5);
	const setAPIKey = (vale: string) => {
		changeAPIKEY(vale);
		localStorage.setItem("APIKEY", vale);
	};
	const setTemperature = (vale: number) => {
		changeTemperature(vale);
	};
	const Markdown = ({ content }: { content: string }) => {
		return (
			<ReactMarkdown
				remarkPlugins={[remarkMath, remarkGfm]}
				rehypePlugins={[rehypeHighlight, format, rehypeKatex]}
				components={{
					pre: ({ children }) => <pre className="not-prose ">{children}</pre>,
					code: ({ node, className, children, ...props }) => {
						const match = /language-(\w+)/.exec(className || "");
						console.log(className);
						if (match?.length) {
							const id = Math.random().toString(36).substr(2, 9);
							return (
								<div className="not-prose rounded-md  bg-[#2e3037]">
									<div className="flex h-12 items-center rounded-md py-1.5 px-4 justify-between bg-[#27282d] dark:bg-[#27282d]">
										<div className="flex items-center gap-2">
											<Terminal size={18} />
											<p className="text-sm text-white dark:text-zinc-400 ">
												{(node?.properties?.className as Array<string>)[1]}
											</p>
										</div>
										<CopyButton id={id} />
									</div>
									<div className="overflow-x-auto">
										<div
											id={id}
											className="p-4">
											{children}
										</div>
									</div>
								</div>
							);
						} else {
							return (
								<code
									{...props}
									className="not-prose rounded bg-gray-100 px-1 dark:bg-zinc-900">
									{children}
								</code>
							);
						}
					},
				}}
				className="prose prose-zinc max-w-2xl dark:prose-invert text-white">
				{content}
			</ReactMarkdown>
		);
	};
	function handleSend(type: string, val: string) {
		if (APIKEY != "") {
			if (type === "text" && val.trim()) {
				appendMsg({
					type: "text",
					content: { text: val },
					position: "right",
				});
				const data = JSON.stringify({
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: "user",
							content: val,
						},
					],
					temperature: temperature,
				});
				setTyping(true);
				const config = {
					method: "post",
					url: "https://api.chatanywhere.com.cn/v1/chat/completions",
					headers: {
						'Authorization': `Bearer ${APIKEY}`,
						'User-Agent': 'Apifox/1.0.0 (https://apifox.com)', 
						"Content-Type": "application/json",
					},
					data: data,
				};
				axios(config)
					.then(function (response) {
						console.log(response);
						
						appendMsg({
							type: "text",
							content: {
								text: response.data.choices[0].message.content.toString(),
							},
						});
					})
					.catch(function (error) {
						console.log(error);
						toast.fail(JSON.parse(error.request.responseText).error.message);
						changeAPIKEY("");
						setTyping(false);
					});
			}
		} else {
			toast.fail("未获取APIKey!");
		}
	}
	window.onload = function () {
		appendMsg({
			type: "text",
			content: {
				text: "Notice",
			},
			position: "center",
		});
		changeAPIKEY(localStorage.getItem("APIKEY") as string);
	};
	function renderMessageContent(msg: MessageProps) {
		const { content, position } = msg;
		if (position == "right") {
			return (
				<Flex
					className="rounded-md bg-[#2e3037]"
					center
					style={{
						width: "100%",
						height: "auto",
						borderBottom: "solid black 1px",
						paddingTop: "25px",
						paddingBottom: "25px",
					}}>
					<div style={{ width: "50%", wordWrap: "break-word", color: "white" }}>
						<div style={{ marginBottom: "12px" }}>
							<UserIcon style={{ width: "24px", height: "24px" }}></UserIcon>
						</div>
						{content.text}
					</div>
				</Flex>
			);
		} else if (position == "center") {
			return (
				<Flex
					className="rounded-md"
					center
					style={{
						width: "100%",
						height: "auto",
						background: "rgb(36,50,64)",
						paddingTop: "3px",
						paddingBottom: "18px",
					}}>
					<div style={{ width: "50%", wordWrap: "break-word", color: "white" }}>
						<div>
							<div style={{ paddingTop: "15px", paddingBottom: "15px" }}>
								<strong>
									<span style={{ fontSize: "2rem", marginRight: "25px" }}>
										Notice!!!
									</span>
								</strong>
								<span style={{ fontSize: ".8rem" }}>
									点击获取免费的
									<a
										href="https://api.chatanywhere.org/v1/oauth/free/github/render"
										target="_blank"
										style={{
											color: "white",
											marginLeft: "10px",
											marginRight: "10px",
											textDecoration: "underline",
										}}>
										API Key
									</a>
									复制到此后开始使用。
								</span>
							</div>
							<label className="input input-bordered flex items-center gap-2 mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="w-4 h-4 opacity-70">
									<path
										fillRule="evenodd"
										d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
										clipRule="evenodd"
									/>
								</svg>
								<input
									type="password"
									className="grow overflow-hidden"
									style={{ border: "none"}}
									value={APIKEY as string}
									onChange={(e) => {
										setAPIKey(e.target.value);
									}}></input>
							</label>
							<input
									type="range"
									min={0}
									max="2"
									value={temperature}
									className="range"
									step="0.1"
									onChange={(e) => {
										setTemperature(Number(e.target.value));
									}}
								/>
								<div className="flex justify-between text-xs px-2">
									<span>0</span>
									<span>0.5</span>
									<span>1</span>
									<span>1.5</span>
									<span>2</span>
								</div>
								<div style={{fontSize:".8rem",marginTop:"12px"}}>当前设置温度为 <strong>{temperature}</strong> (温度越高得到的结果越随机)</div>
						</div>
					</div>
				</Flex>
			);
		} else if (position == "left") {
			return (
				<Flex
					center
					style={{
						width: "100%",
						height: "auto",
						background: "rgba(55,56,67,0)",
						paddingTop: "25px",
						paddingBottom: "25px",
					}}>
					<div style={{ width: "50%", wordWrap: "break-word", color: "white" }}>
						<div style={{ marginBottom: "12px" }}>
							<svg
								className="icon"
								viewBox="0 0 1024 1024"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								p-id="12742"
								width="24"
								height="24">
								<path
									d="M640 128c212.074667 0 384 171.925333 384 384S852.074667 896 640 896H384C171.925333 896 0 724.074667 0 512s171.925333-384 384-384z m0 96H384C224.938667 224 96 352.938667 96 512s128.938667 288 288 288h256c159.061333 0 288-128.938667 288-288S799.061333 224 640 224zM384 384v192h-96V384h96z m352 0v192h-96V384h96z"
									fill="#ffffff"
									p-id="12743"></path>
							</svg>
						</div>
						<Markdown content={content.text}></Markdown>
					</div>
				</Flex>
			);
		}
	}
	return (
		<>
			<Chat
				locale="en-US"
				navbar={{ title: "Easy ChatAI" }}
				messages={messages}
				renderMessageContent={renderMessageContent}
				onSend={handleSend}
				placeholder="输入一条消息 / 回车后发送"
			/>
		</>
	);
}

// 导出组件时要以大写字母开头
export default AiChat;
