import { NextRequest, NextResponse } from "next/server";
import { getPagesData } from "../../../utils/fetchingFunctions";
import { DEFAULT_LOCALE } from "../../../utils/localization";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const PREVIEW_SECRET = "preview";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const slugFromParams = req.nextUrl.searchParams.get("slug");
  const slug = slugFromParams
    ? Array.isArray(slugFromParams)
      ? slugFromParams[0]
      : slugFromParams
    : "";

  const localeFromParams = req.nextUrl.searchParams.get("locale");
  const locale = localeFromParams
    ? Array.isArray(localeFromParams)
      ? localeFromParams[0]
      : localeFromParams
    : DEFAULT_LOCALE;

  const pageData = await getPagesData(slug, true, locale);

  if (!pageData) {
    return NextResponse.json({ message: "Invalid slug" }, { status: 401 });
  }

  draftMode().enable();
  redirect(`/${locale}/${slug}`);
}