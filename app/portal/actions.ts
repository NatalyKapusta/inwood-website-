"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/seo";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/portal/login?error=${encodeURIComponent("Невірний email або пароль")}`);
  }

  if (data.user) {
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("blocked")
      .eq("id", data.user.id)
      .single();
    if (myProfile?.blocked) {
      await supabase.auth.signOut();
      redirect(`/portal/login?error=${encodeURIComponent("Доступ заблоковано. Зверніться до вашого менеджера IN WOOD")}`);
    }
  }

  redirect("/portal");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

// Публічно: користувач сам запитує лист для скидання пароля.
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect("/portal/forgot-password?error=" + encodeURIComponent("Вкажіть email"));
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/portal/set-password`,
  });

  // Навмисно не повідомляємо, чи існує такий email — щоб не розкривати список користувачів.
  redirect("/portal/forgot-password?sent=1");
}

// Лише staff: запросити нового партнера/співробітника поштою.
export async function inviteUser(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "staff") {
    redirect("/portal/users?error=" + encodeURIComponent("Недостатньо прав"));
  }

  const email = String(formData.get("email") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const role = String(formData.get("role") ?? "dealer");

  if (!email) {
    redirect("/portal/users?error=" + encodeURIComponent("Вкажіть email"));
  }

  const admin = createAdminClient();

  const { data: existing } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (existing) {
    redirect(
      "/portal/users?error=" +
        encodeURIComponent("Цей email уже зареєстровано — змініть роль у таблиці нижче, повторне запрошення не потрібне")
    );
  }

  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/portal/set-password`,
  });

  if (error || !invited?.user) {
    redirect("/portal/users?error=" + encodeURIComponent(error?.message ?? "Не вдалося запросити користувача"));
  }

  await admin
    .from("profiles")
    .update({ full_name: fullName || null, company_name: companyName || null, role })
    .eq("id", invited.user.id);

  revalidatePath("/portal/users");
  redirect("/portal/users?invited=" + encodeURIComponent(email));
}

// Лише staff: змінити роль уже зареєстрованого користувача.
export async function updateUserRole(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "staff") {
    redirect("/portal/users?error=" + encodeURIComponent("Недостатньо прав"));
  }

  const targetId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "");
  const validRoles = ["dealer", "dealer_distributor", "manager", "staff"];

  if (!targetId || !validRoles.includes(role)) {
    redirect("/portal/users?error=" + encodeURIComponent("Некоректні дані"));
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role }).eq("id", targetId);
  if (error) {
    redirect("/portal/users?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/portal/users");
  redirect("/portal/users?roleUpdated=1");
}

// Лише staff: заблокувати або розблокувати доступ користувача до порталу.
export async function toggleUserAccess(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "staff") {
    redirect("/portal/users?error=" + encodeURIComponent("Недостатньо прав"));
  }

  const targetId = String(formData.get("user_id") ?? "");
  const block = formData.get("block") === "1";

  if (!targetId) {
    redirect("/portal/users?error=" + encodeURIComponent("Не вказано користувача"));
  }
  if (targetId === user.id) {
    redirect("/portal/users?error=" + encodeURIComponent("Не можна заблокувати власний доступ"));
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(targetId, {
    ban_duration: block ? "876000h" : "none",
  });
  if (error) {
    redirect("/portal/users?error=" + encodeURIComponent(error.message));
  }

  await admin.from("profiles").update({ blocked: block }).eq("id", targetId);

  revalidatePath("/portal/users");
  redirect("/portal/users?" + (block ? "blocked" : "unblocked") + "=1");
}

// Лише staff: повністю видалити користувача (можна одразу запросити той самий email заново).
export async function deleteUserAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "staff") {
    redirect("/portal/users?error=" + encodeURIComponent("Недостатньо прав"));
  }

  const targetId = String(formData.get("user_id") ?? "");

  if (!targetId) {
    redirect("/portal/users?error=" + encodeURIComponent("Не вказано користувача"));
  }
  if (targetId === user.id) {
    redirect("/portal/users?error=" + encodeURIComponent("Не можна видалити власний обліковий запис"));
  }

  const admin = createAdminClient();

  // Знімаємо посилання на користувача з його КП та перевизначень цін —
  // самі записи (історія) лишаються, просто без автора.
  await admin.from("quotes").update({ created_by: null }).eq("created_by", targetId);
  await admin.from("price_overrides").update({ created_by: null }).eq("created_by", targetId);
  await admin.from("site_settings").update({ updated_by: null }).eq("updated_by", targetId);

  const { error } = await admin.auth.admin.deleteUser(targetId);
  if (error) {
    redirect("/portal/users?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/portal/users");
  redirect("/portal/users?deleted=1");
}

// Лише staff: створити ручне перевизначення ціни/розміру.
export async function createOverride(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const productCode = String(formData.get("product_code") ?? "").trim();
  const customPrice = formData.get("custom_price") ? Number(formData.get("custom_price")) : null;
  const customSizeNote = String(formData.get("custom_size_note") ?? "").trim() || null;
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!productCode) {
    redirect("/portal/overrides?error=" + encodeURIComponent("Вкажіть код товару"));
  }

  const { error } = await supabase.from("price_overrides").insert({
    product_code: productCode,
    custom_price: customPrice,
    custom_size_note: customSizeNote,
    comment,
    created_by: user.id,
  });

  if (error) {
    redirect("/portal/overrides?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/portal/overrides");
  redirect("/portal/overrides");
}

// Лише staff: перемкнути видимість роздрібних цін на публічному сайті.
export async function setPricesVisible(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "staff") redirect("/portal");

  const visible = formData.get("visible") === "true";

  await supabase
    .from("site_settings")
    .upsert({ key: "prices_visible", value: visible, updated_by: user.id, updated_at: new Date().toISOString() });

  revalidatePath("/portal");
  revalidatePath("/ua/catalog");
  revalidatePath("/ru/catalog");
  revalidatePath("/en/catalog");
  redirect("/portal");
}
