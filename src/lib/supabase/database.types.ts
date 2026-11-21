// Dibuat dari database naratia-dev (Supabase MCP generate_typescript_types), lalu dipangkas
// ke tipe Database saja. Buat ulang setiap kali skema berubah.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Rel = {
	foreignKeyName: string;
	columns: string[];
	isOneToOne: boolean;
	referencedRelation: string;
	referencedColumns: string[];
};

export type Database = {
	__InternalSupabase: { PostgrestVersion: '14.18' };
	public: {
		Tables: {
			candidates: {
				Row: {
					author_id: string;
					body: string;
					created_at: string;
					id: string;
					process_json: Json | null;
					round_id: string;
					status: string;
					thread_claims: Json;
				};
				Insert: never;
				Update: never;
				Relationships: Rel[];
			};
			chapters: {
				Row: { created_at: string; id: string; number: number; status: string; story_id: string };
				Insert: never;
				Update: never;
				Relationships: Rel[];
			};
			paragraphs: {
				Row: {
					author_id: string;
					body: string;
					chapter_id: string;
					created_at: string;
					id: string;
					idx: number;
					process_json: Json | null;
					story_id: string;
					wound: boolean;
				};
				Insert: {
					author_id: string;
					body: string;
					chapter_id: string;
					idx: number;
					story_id: string;
				};
				Update: { body?: string };
				Relationships: Rel[];
			};
			profiles: {
				Row: { created_at: string; id: string; username: string };
				Insert: never;
				Update: never;
				Relationships: Rel[];
			};
			rounds: {
				Row: {
					candidate_count: number;
					closes_at: string;
					constraint_key: string | null;
					extended_count: number;
					holder_id: string | null;
					id: string;
					number: number;
					opens_at: string;
					preset: string;
					status: string;
					story_id: string;
					winner_candidate_id: string | null;
				};
				Insert: never;
				Update: never;
				Relationships: Rel[];
			};
			stories: {
				Row: {
					chapter_size: number;
					created_at: string;
					created_by: string;
					genre: string;
					id: string;
					license: string;
					mode: string;
					paragraph_count: number;
					slug: string;
					status: string;
					title: string;
					updated_at: string;
				};
				Insert: never;
				Update: never;
				Relationships: Rel[];
			};
			votes: {
				Row: { candidate_id: string; created_at: string; round_id: string; voter_id: string };
				Insert: never;
				Update: never;
				Relationships: Rel[];
			};
		};
		Views: {
			home_stories: {
				Row: {
					chapter_status: string | null;
					genre: string | null;
					id: string | null;
					mode: string | null;
					paragraph_count: number | null;
					round_candidate_count: number | null;
					round_closes_at: string | null;
					round_constraint_key: string | null;
					round_number: number | null;
					slug: string | null;
					status: string | null;
					title: string | null;
					updated_at: string | null;
				};
				Relationships: Rel[];
			};
		};
		Functions: {
			claim_username: {
				Args: { p_username: string };
				Returns: { created_at: string; id: string; username: string };
			};
			dev_reset_sample: { Args: never; Returns: undefined };
		};
		Enums: { [_ in never]: never };
		CompositeTypes: { [_ in never]: never };
	};
};
