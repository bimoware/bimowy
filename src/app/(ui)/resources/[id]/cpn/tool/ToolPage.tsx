import { LanguageCode } from "@/lib/locale"
import { AnyToolBuilder } from "@/lib/resources/builders/tool"
import ALL_WIDGETS from "@cpn/widgets"

export default function ToolPage({ tool }: {
    tool: ReturnType<AnyToolBuilder["serialize"]>,
    locale: LanguageCode
}){
    const Widget = ALL_WIDGETS[tool.widget_id]
    return <div className="w-full h-full flex p-2">
        {/* @ts-expect-error Will check later */}
        <Widget/>
        </div>
}